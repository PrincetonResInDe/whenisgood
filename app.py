from apiclient.discovery import build
from cas import CASClient
import datetime
from flask import Flask, redirect, render_template, request, session, url_for
import json
from oauth2client import client
import os
import mysql.connector

app = Flask(__name__)
app.secret_key = os.environ.get("APP_SECRET_KEY")

cas_client = CASClient(
    version = 3,
    service_url = os.environ.get("CAS_SERVICE_URL"),
    server_url = os.environ.get("CAS_SERVER_URL")
)

# TODO
# reinstate connection with every proc call
# otherwise connection gets dropped periodically
db = mysql.connector.connect(
	host=os.environ.get("DB_HOST"),
    database=os.environ.get("DB_NAME"),
    user=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD")
)
db_cursor = db.cursor()

@app.route("/")
def index():
    if "netID" not in session:
        return redirect(url_for("login"))
    db_cursor.callproc("getEvents", (session["netID"],))
    for result in db_cursor.stored_results():
        events = result
        #print(type(result.description))
        #print(type(result.fetchall()))
        #for column in result.description:
        #    print(column[0])
        #for row in result.fetchall():
        #    print(row)
    return render_template("index.html", name=session["name"], events=events)

@app.route("/event/<uuid>", methods = ["GET", "POST"])
def event(uuid):
    session["eventUUID"] = request.view_args["uuid"]
    if "netID" not in session:
        return redirect(url_for("login"))
    eventUUID = session.pop("eventUUID", None)
    if not eventUUID:
        return redirect(url_for("index"))
    if request.method == "POST":
        # remove this .format
        return redirect("/event/{}".format(eventUUID))
    return render_template("respond.html", eventUUID=eventUUID)


@app.route("/create", methods = ["GET", "POST"])
def create():
    if "netID" not in session:
        return redirect(url_for("login"))
    if request.method == "POST":
        name = request.form.get("name")
        description = request.form.get("description")
        startDate = request.form.get("startDate")
        endDate = request.form.get("endDate")
        db_cursor.callproc("addEvent", (session["netID"], name, 
                description, startDate, endDate))
        db.commit()
        return redirect(url_for("index"))
    return render_template("create.html")

@app.route("/results")
def results():
    if "netID" not in session:
        return redirect(url_for("login"))
    return "results"

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
    db_cursor.callproc("login", (session["netID"], session["name"]))
    db.commit()
    if "eventUUID" in session:
        # is .format bad?
        return redirect("/event/{}".format(session["eventUUID"]))
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
