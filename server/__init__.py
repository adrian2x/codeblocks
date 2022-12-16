from flask import Flask, render_template
from server.firebase import db

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")
