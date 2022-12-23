from flask import Blueprint, render_template, request, jsonify
from server.firebase import db, firestore

web_blueprint = Blueprint(
    "web",
    __name__,
    static_url_path="/",
    static_folder="../frontend/dist",
    template_folder="../frontend/dist",
)


@web_blueprint.route("/")
@web_blueprint.route("/post")
@web_blueprint.route("/posts/<path>")
def catch_all(path=None):
    print("request", path)
    return web_blueprint.send_static_file("index.html")
