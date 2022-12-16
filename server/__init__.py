from flask import Flask
from server.firebase import db

app = Flask(__name__)


@app.route("/")
def index():
    return "<h1>Hello, World!</h1>"
