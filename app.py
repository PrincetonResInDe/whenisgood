from cas import CASClient
import datetime
from flask import Flask, redirect, render_template, request, session, url_for
from apiclient.discovery import build
from oauth2client import client
import json
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
    return render_template("index.html")

@app.route("/events")
def events():
    if "username" not in session:
        return redirect(url_for("index"))
    
    event_summaries = []
    if "credentials" in session:

        creds = client.OAuth2Credentials.from_json(session["credentials"])
        service = build('calendar', 'v3', credentials=creds)
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(calendarId="primary",
                                        timeMin=now, maxResults=10,
                                        singleEvents=True, orderBy="startTime"
                                        ).execute()
        events = events_result.get("items", [])

        if events:
            for event in events:
                event_summaries.append(event["summary"])

    print(event_summaries)

    return render_template("events.html", username=session["username"], 
                                    displayname=session["displayname"],
                                    events=event_summaries)

@app.route("/importgcal")
def importgcal():
    if "username" not in session:
        return redirect(url_for("index"))

    if "credentials" not in session:
        return redirect(url_for("oauth2callback"))

    credentials = client.OAuth2Credentials.from_json(session["credentials"])
    
    if credentials.access_token_expired:
        return redirect(url_for("oauth2callback"))

    return redirect(url_for("events"))

@app.route("/oauth2callback")
def oauth2callback():
    flow = client.flow_from_clientsecrets( # store client secret as config var
        "client_secret.json",              # create json file on program start
        scope = "https://www.googleapis.com/auth/calendar",
        redirect_uri = url_for("oauth2callback", _external=True)
    )

    if "code" not in request.args:
        auth_uri = flow.step1_get_authorize_url()
        return redirect(auth_uri)

    auth_code = request.args.get("code")
    credentials = flow.step2_exchange(auth_code)
    session["credentials"] = credentials.to_json()
    return redirect(url_for("importgcal"))

@app.route("/login")
def login():
    if "username" in session:
        return redirect(url_for("events"))

    next = request.args.get("next")
    ticket = request.args.get("ticket")

    if not ticket:
        cas_login_url = cas_client.get_login_url()
        return redirect(cas_login_url)

    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    if not user:
        return "Failed to verify ticket."

    session["username"] = user
    session["displayname"] = attributes["displayname"]

    return redirect(next)

@app.route("/logout")
def logout():
    redirect_url = url_for("logout_callback", _external=True)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    return redirect(cas_logout_url)

@app.route("/logout_callback")
def logout_callback():
    session.pop("username", None)
    return redirect(url_for("index"))


if __name__ == "__main__":
    with open("client_secret.json", "w") as f:
        json.dump(json.loads(os.environ.get("GOOGLE_CLIENT_SECRET")), f)
    app.run()
