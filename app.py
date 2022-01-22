from api import call_proc
from cas import CASClient
from flask import Flask, redirect, request, session, url_for, jsonify
import os
from email.message import EmailMessage
import smtplib
import ssl

app = Flask(__name__, static_folder='frontend/build', static_url_path='/')
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
    return app.send_static_file("index.html")

@app.errorhandler(404)   
def not_found(e):
    if "netID" not in session:
        session["next"] = request.url
        return redirect(url_for("login"))
    return app.send_static_file('index.html')

@app.route("/api", methods=["POST"])
def api():
    if "netID" not in session:
        return redirect(url_for("login"))
    data = request.get_json()
    data["params"].insert(0, session["netID"])
    result = call_proc(data["sp_name"], data["params"])
    return jsonify(result)

@app.route("/email", methods=["POST"])
def email():
    if "netID" not in session:
        return redirect(url_for("login"))
    data = request.get_json()
    msg = EmailMessage()
    msg["To"] = os.environ.get("EMAIL") # loop over emails in data
    msg["From"] = os.environ.get("EMAIL")
    msg["Subject"] = "TigerMeet Invitation"
    msg.set_content("You have been invited!")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ssl.create_default_context()) as server:
        server.login(msg["From"], os.environ.get("EMAIL_PASSWORD"))
        server.send_message(msg)
        server.quit()

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
    if "next" in session:
        next = session.pop("next")
    return redirect(next)

@app.route("/logout")
def logout():
    redirect_url = url_for("logout_callback", _external=True)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    return redirect(cas_logout_url)

@app.route("/logout_callback")
def logout_callback():
    session.clear()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run()
