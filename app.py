from api import call_proc
from apiclient.discovery import build
from cas import CASClient
import datetime
from flask import Flask, redirect, render_template, request, session, url_for
import json
from oauth2client import client
import os

app = Flask(__name__)
app.secret_key = os.environ.get("APP_SECRET_KEY")

cas_client = CASClient(
    version = 3,
    service_url = os.environ.get("CAS_SERVICE_URL"),
    server_url = os.environ.get("CAS_SERVER_URL")
)

@app.route("/")
def index():
    if "netID" not in session:
        return redirect(url_for("login"))
    events = call_proc("getEvents", (session["netID"],))
        #print(type(result.description))
        #print(type(result.fetchall()))
        #for column in result.description:
        #    print(column[0])
        #for row in result.fetchall():
        #    print(row)
    return render_template("index.html", name=session["name"], events=events)

@app.route("/events/<uuid>", methods = ["GET", "POST"])
def event(uuid):
    session["eventUUID"] = request.view_args["uuid"]
    if "netID" not in session:
        return redirect(url_for("login"))
    eventUUID = session.pop("eventUUID", None)
    if not eventUUID:
        return redirect(url_for("index"))
    if request.method == "POST":
        startTime = request.form.get("startTime")
        endTime = request.form.get("endTime")
        call_proc("addAvailability", (session["netID"], eventUUID,
                startTime, endTime))
        return redirect("/events/{}".format(eventUUID))
    avails = call_proc("getAvailabilities", (eventUUID, session["netID"]))
    return render_template("respond.html", eventUUID=eventUUID,
            avails=avails)


@app.route("/create", methods = ["GET", "POST"])
def create():
    if "netID" not in session:
        return redirect(url_for("login"))
    if request.method == "POST":
        name = request.form.get("name")
        description = request.form.get("description")
        startDate = request.form.get("startDate")
        endDate = request.form.get("endDate")
        call_proc("addEvent", (session["netID"], name, 
                description, startDate, endDate))
        return redirect(url_for("index"))
    return render_template("create.html")

@app.route("/edit/<uuid>", methods = ["GET", "POST"])
def edit(uuid):
    session["editUUID"] = request.view_args["uuid"]
    if "netID" not in session:
        return redirect(url_for("login"))
    editUUID = session.pop("editUUID", None)
    if not editUUID:
        return redirect(url_for("index"))
    if request.method == "POST":
        name = request.form.get("name")
        description = request.form.get("description")
        startDate = request.form.get("startDate")
        endDate = request.form.get("endDate")
        call_proc("editEvent", (editUUID, session["netID"],
                name, description, startDate, endDate))
        return redirect(url_for("index"))
    return render_template("edit.html", editUUID=editUUID)

@app.route("/results/<uuid>")
def results(uuid):
    session["resultUUID"] = request.view_args["uuid"]
    if "netID" not in session:
        return redirect(url_for("login"))
    resultUUID = session.pop("resultUUID", None)
    if not resultUUID:
        return redirect(url_for("index"))
    owner = None
    for result in call_proc("getEventOwner", (resultUUID,)):
        owner = result[0]
        break
    if session["netID"] != owner:
        return redirect(url_for("index"))
    avails = call_proc("getAvailabilities", (resultUUID, None))
    return render_template("results.html", avails=avails)

@app.route("/api")
def api():
    if "netID" not in session:
        return redirect(url_for("login"))
    return "api"

@app.route("/login")
def login():
    if "netID" in session:
        return redirect(url_for("index"))
    next = request.args.get("next")
    ticket = request.args.get("ticket")
    if not ticket:
        cas_login_url = cas_client.get_login_url()
        return redirect(cas_login_url)
    user, attributes, pgtiou = cas_client.verify_ticket(ticket)
    if not user:
        return "Failed to verify ticket."
    session["netID"] = user
    session["name"] = attributes["displayname"]
    call_proc("login", (session["netID"], session["name"]))
    if "eventUUID" in session:
        return redirect("/events/{}".format(session["eventUUID"]))
    elif "resultUUID" in session:
        return redirect("/results/{}".format(session["resultUUID"]))
    elif "editUUID" in session:
        return redirect("/edit/{}".format(session["editUUID"]))
    return redirect(next)

@app.route("/logout")
def logout():
    redirect_url = url_for("logout_callback", _external=True)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    return redirect(cas_logout_url)

@app.route("/logout_callback")
def logout_callback():
    session.clear()
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run()
