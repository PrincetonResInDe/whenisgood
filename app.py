from cas import CASClient
from flask import Flask, redirect, render_template, request, session, url_for

app = Flask(__name__)
app.secret_key = "pupBxUMCEkX78RY8GABNgyaq"

cas_client = CASClient(
    version = 3,
    service_url = "http://localhost:5000/login?next=%2Fevents",
    server_url = "https://fed.princeton.edu/cas/"
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/events")
def events():
    if "username" in session:
        return render_template("events.html", username=session["username"], 
                                    displayname = session["displayname"])
    return redirect(url_for("index"))

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
    print(user)
    print(attributes)
    print(pgtiou)

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
    app.run()
