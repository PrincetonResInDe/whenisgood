from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def index():
    return "WhenIsGood, but better!\n"

if __name__ == "__main__":
    app.run()
