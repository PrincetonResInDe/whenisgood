from api import call_proc
from apiclient.discovery import build
from cas import CASClient
import datetime
from flask import Flask, redirect, render_template, request, session, url_for, jsonify, make_response
import json
from oauth2client import client
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r'/*' : {'origins': ['http://localhost:3000']}})
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
    return redirect("http://localhost:3000/")

@app.route("/api", methods=["POST"])
def api():
    session["netID"] = "ls3841"
    if "netID" not in session:
        return redirect(url_for("login"))
    data = request.get_json()
    data["params"].insert(0, session["netID"])
    result = call_proc(data["sp_name"], data["params"])
    return jsonify(result)

@app.route("/importgcal", methods=["GET", "POST"])
def importgcal():
    #if "netID" not in session:
    #    return redirect(url_for("index"))
    '''
    if "credentials" not in session:
        return redirect(url_for("oauth2callback"))
        #return redirect(url_for("index"))

    data = request.get_json() or {}
    data["timeMin"] = "2021-11-22T00:00:00.000Z"
    data["timeMax"] = "2021-11-29T00:00:00.000Z"

    credentials = client.OAuth2Credentials.from_json(session["credentials"])

    if credentials.access_token_expired:
        return redirect(url_for("oauth2callback"))

    #return redirect(url_for("events"))
    service = build('calendar', 'v3', credentials=credentials)
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(calendarId="primary",
                                    timeMin=data["timeMin"], timeMax=data["timeMax"],
                                    singleEvents=True, orderBy="startTime"
                                    ).execute()
    events = events_result.get("items", [])
    '''
    events = [{"created":"2021-09-18T17:38:38.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-22T09:50:00-05:00","timeZone":"America/New_York"},"etag":"\"3263973537664000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=M3BqNDhzaHZ2Zzh1cmduc2dwZDNvMWk0ZGVfMjAyMTExMjJUMTQwMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"3pj48shvvg8urgnsgpd3o1i4de@google.com","id":"3pj48shvvg8urgnsgpd3o1i4de_20211122T140000Z","kind":"calendar#event","location":"Jadwin Hall 111","organizer":{"email":"ls3841@princeton.edu","self":True},"originalStartTime":{"dateTime":"2021-11-22T09:00:00-05:00","timeZone":"America/New_York"},"recurringEventId":"3pj48shvvg8urgnsgpd3o1i4de","reminders":{"overrides":[{"method":"popup","minutes":15}],"useDefault":False},"sequence":0,"start":{"dateTime":"2021-11-22T09:00:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"PHY 103 - C01B","updated":"2021-09-18T17:39:28.832Z"},{"created":"2021-09-18T17:38:38.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-22T12:20:00-05:00","timeZone":"America/New_York"},"etag":"\"3263973537664000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=MmRrdGIxOWV2cTJnaDlxZ3Vra202cTNvMmdfMjAyMTExMjJUMTYwMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"2dktb19evq2gh9qgukkm6q3o2g@google.com","id":"2dktb19evq2gh9qgukkm6q3o2g_20211122T160000Z","kind":"calendar#event","location":"Fine Hall 1201","organizer":{"email":"ls3841@princeton.edu","self":True},"originalStartTime":{"dateTime":"2021-11-22T11:00:00-05:00","timeZone":"America/New_York"},"recurringEventId":"2dktb19evq2gh9qgukkm6q3o2g","reminders":{"overrides":[{"method":"popup","minutes":15}],"useDefault":False},"sequence":0,"start":{"dateTime":"2021-11-22T11:00:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"MAT 201 - C02B","updated":"2021-09-18T17:39:28.832Z"},{"created":"2021-09-18T17:38:38.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-22T16:20:00-05:00","timeZone":"America/New_York"},"etag":"\"3269596897927000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=NGFxNjQ2bzd2bGd2YTBiMjRwMWQwbWU3aWtfMjAyMTExMjJUMTgzMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"4aq646o7vlgva0b24p1d0me7ik@google.com","id":"4aq646o7vlgva0b24p1d0me7ik_20211122T183000Z","kind":"calendar#event","location":"Engineering Quadrangle J323","organizer":{"email":"ls3841@princeton.edu","self":True},"originalStartTime":{"dateTime":"2021-11-22T13:30:00-05:00","timeZone":"America/New_York"},"recurringEventId":"4aq646o7vlgva0b24p1d0me7ik","reminders":{"overrides":[{"method":"popup","minutes":15}],"useDefault":False},"sequence":2,"start":{"dateTime":"2021-11-22T13:30:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"FRS 179 - S01","updated":"2021-11-22T19:42:09.095Z"},{"created":"2021-11-22T17:53:47.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-22T17:30:00-05:00","timeZone":"America/New_York"},"etag":"\"3275207255838000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=M3Bza2ZrZTA4OTJuYjVyN21qOHNqNzRncWEgbHMzODQxQHByaW5jZXRvbi5lZHU","iCalUID":"3pskfke0892nb5r7mj8sj74gqa@google.com","id":"3pskfke0892nb5r7mj8sj74gqa","kind":"calendar#event","organizer":{"email":"ls3841@princeton.edu","self":True},"reminders":{"useDefault":True},"sequence":0,"start":{"dateTime":"2021-11-22T16:30:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"COS","updated":"2021-11-22T17:53:47.919Z"},{"attendees":[{"email":"ishirai@princeton.edu","responseStatus":"accepted"},{"email":"mspecht@princeton.edu","responseStatus":"accepted"},{"email":"ls3841@princeton.edu","responseStatus":"accepted","self":True},{"email":"kacquah@princeton.edu","organizer":True,"responseStatus":"accepted"}],"created":"2021-10-04T14:39:26.000Z","creator":{"email":"kacquah@princeton.edu"},"end":{"dateTime":"2021-11-22T19:45:00-05:00","timeZone":"America/New_York"},"etag":"\"3267992451218000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=NmxwZnFwcjdpbXZjOWVhZWFhNW51ZWpncWtfMjAyMTExMjNUMDAwMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"6lpfqpr7imvc9eaeaa5nuejgqk_R20211025T230000@google.com","id":"6lpfqpr7imvc9eaeaa5nuejgqk_20211123T000000Z","kind":"calendar#event","location":"Wilcox Hall 208","organizer":{"email":"kacquah@princeton.edu"},"originalStartTime":{"dateTime":"2021-11-22T19:00:00-05:00","timeZone":"America/New_York"},"recurringEventId":"6lpfqpr7imvc9eaeaa5nuejgqk_R20211025T230000","reminders":{"useDefault":True},"sequence":0,"start":{"dateTime":"2021-11-22T19:00:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"ResInDe WhenIsGood Team Meeting","updated":"2021-10-11T23:50:25.609Z"},{"created":"2021-09-18T17:38:38.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-23T09:50:00-05:00","timeZone":"America/New_York"},"etag":"\"3263973537664000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=NTlqOWg4YWt2cXVwMXRwMGNnb2Z1bnM2M3RfMjAyMTExMjNUMTQwMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"59j9h8akvqup1tp0cgofuns63t@google.com","id":"59j9h8akvqup1tp0cgofuns63t_20211123T140000Z","kind":"calendar#event","location":"McDonnell A02","organizer":{"email":"ls3841@princeton.edu","self":True},"originalStartTime":{"dateTime":"2021-11-23T09:00:00-05:00","timeZone":"America/New_York"},"recurringEventId":"59j9h8akvqup1tp0cgofuns63t","reminders":{"overrides":[{"method":"popup","minutes":15}],"useDefault":False},"sequence":1,"start":{"dateTime":"2021-11-23T09:00:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"PHY 103 - L01","updated":"2021-09-18T17:39:28.832Z"},{"created":"2021-09-18T17:38:38.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-23T10:50:00-05:00","timeZone":"America/New_York"},"etag":"\"3263973537664000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=N3JhdDB1cXEwZGtpdmhuOGZnM3BjZHFjdTRfMjAyMTExMjNUMTUwMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"7rat0uqq0dkivhn8fg3pcdqcu4@google.com","id":"7rat0uqq0dkivhn8fg3pcdqcu4_20211123T150000Z","kind":"calendar#event","location":"Friend Center 101","organizer":{"email":"ls3841@princeton.edu","self":True},"originalStartTime":{"dateTime":"2021-11-23T10:00:00-05:00","timeZone":"America/New_York"},"recurringEventId":"7rat0uqq0dkivhn8fg3pcdqcu4","reminders":{"overrides":[{"method":"popup","minutes":15}],"useDefault":False},"sequence":0,"start":{"dateTime":"2021-11-23T10:00:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"COS 217 - L01","updated":"2021-09-18T17:39:28.832Z"},{"created":"2021-09-18T17:38:38.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-23T14:20:00-05:00","timeZone":"America/New_York"},"etag":"\"3263973537664000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=MnJobWN1b3JndnIzZTY3MnZpNjFtdGZocnZfMjAyMTExMjNUMTgzMDAwWiBsczM4NDFAcHJpbmNldG9uLmVkdQ","iCalUID":"2rhmcuorgvr3e672vi61mtfhrv@google.com","id":"2rhmcuorgvr3e672vi61mtfhrv_20211123T183000Z","kind":"calendar#event","location":"Friend Center 009","organizer":{"email":"ls3841@princeton.edu","self":True},"originalStartTime":{"dateTime":"2021-11-23T13:30:00-05:00","timeZone":"America/New_York"},"recurringEventId":"2rhmcuorgvr3e672vi61mtfhrv","reminders":{"overrides":[{"method":"popup","minutes":15}],"useDefault":False},"sequence":1,"start":{"dateTime":"2021-11-23T13:30:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"COS 217 - P07","updated":"2021-09-18T17:39:28.832Z"},{"created":"2021-11-23T17:23:07.000Z","creator":{"email":"ls3841@princeton.edu","self":True},"end":{"dateTime":"2021-11-23T18:00:00-05:00","timeZone":"America/New_York"},"etag":"\"3275376376002000\"","eventType":"default","htmlLink":"https://www.google.com/calendar/event?eid=NW01cHNocHI0bTh1cWJmbmw3cHIxN3Bmc2EgbHMzODQxQHByaW5jZXRvbi5lZHU","iCalUID":"5m5pshpr4m8uqbfnl7pr17pfsa@google.com","id":"5m5pshpr4m8uqbfnl7pr17pfsa","kind":"calendar#event","organizer":{"email":"ls3841@princeton.edu","self":True},"reminders":{"useDefault":True},"sequence":0,"start":{"dateTime":"2021-11-23T17:00:00-05:00","timeZone":"America/New_York"},"status":"confirmed","summary":"DO MATH PSET","updated":"2021-11-23T17:23:08.001Z"}]

    return jsonify(events)

@app.route("/oauth2callback")
def oauth2callback():
    flow = client.flow_from_clientsecrets(
        "client_secret.json",
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
