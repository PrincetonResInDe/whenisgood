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
    return "render template for events list here"

@app.route("/event")
def event():
    session["eventID"] = request.args.get("id")
    if "netID" not in session:
        return redirect(url_for("login"))
    eventID = session.pop("eventID", None)
    if not eventID:
        return redirect(url_for("index"))
    return "eventID: {}".format(eventID)

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
    
    if "eventID" in session:
        return redirect(url_for("event", id=session["eventID"]))

    return redirect(next)

@app.route("/logout")
def logout():
    redirect_url = url_for("logout_callback", _external=True)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    return redirect(cas_logout_url)

@app.route("/logout_callback")
def logout_callback():
    session.pop("netID", None)
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run()
