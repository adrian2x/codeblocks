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


@app.route("/posts/", methods=["POST"])
def posts():
    data = request.get_json()
    doc = db.collection("posts").document(data["id"])
    doc.set(data)

    return jsonify(data)


@app.route("/read/<uid>")
def read(uid):
    posts = db.collection("posts").where("user_id", "==", uid)
    posts_list = [post.to_dict() for post in posts.stream()]
    return jsonify(posts_list)


@app.route("/read_post/<post_id>")
def read_post(post_id):
    posts = db.collection("posts").where("id", "==", post_id)
    for post in posts.stream():
        post_dict = post.to_dict()
    return jsonify(post_dict)


@app.route("/update_post/<post_id>", methods=["POST"])
def update_post(post_id):
    data = request.get_json()
    doc = db.collection("posts").document(post_id)
    doc.set(data)
    return jsonify(data)


@app.route("/update_user/<user_id>", methods=["POST"])
def update_user(user_id):
    data = request.get_json()
    doc = db.collection("users").document(user_id)
    doc.set(data)
    return jsonify(data)
