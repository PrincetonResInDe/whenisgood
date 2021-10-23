from api import call_proc
from apiclient.discovery import build
from cas import CASClient
import datetime
from flask import Flask, redirect, render_template, request, session, url_for, jsonify
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
        return redirect(url_for("api"))
    return render_template("test_api.html")

@app.route("/api", methods=["POST"])
def api():
    if "netID" not in session:
        return redirect(url_for("login"))
    data = request.get_json()
    data["params"].insert(0, session["netID"])
    result = call_proc(data["sp_name"], data["params"])
    return jsonify(result)

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
