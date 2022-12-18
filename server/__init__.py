from flask import Flask, render_template, request, jsonify
from server.firebase import db

app = Flask(
    __name__,
    static_url_path="",
    static_folder="frontend/dist",
    template_folder="frontend/dist",
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/create", methods=["POST"])
def create():
    data = request.get_json()
    doc = db.collection("posts").document()
    doc.set(data)

    userdoc = db.collection("users").document(data["user"]["uid"])
    userdoc.set(data["user"])

    return jsonify(data)


@app.route("/read/<uid>")
def read(uid):
    posts = db.collection("posts").where("user.uid", "==", uid)
    posts_list = [post.to_dict() for post in posts.stream()]
    return jsonify(posts_list)
