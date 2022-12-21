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
    doc = db.collection("posts").document()
    doc.set(data)

    return jsonify(data)


@app.route("/read/<uid>")
def read(uid):
    posts = db.collection("posts").where("user_id", "==", uid)
    posts_list = [post.to_dict() for post in posts.stream()]
    return jsonify(posts_list)


@app.route("/read_user/<uid>")
def read_user(uid):
    user = db.collection("users").document(uid).get().to_dict()
    return jsonify(user)


@app.route("/read_post/<post_id>")
def read_post(post_id):
    post = db.collection("posts").document(post_id).get().to_dict()
    return jsonify(post)


@app.route("/update_post/<post_id>", methods=["POST"])
def update_post(post_id):
    data = request.get_json()
    doc = db.collection("posts").document(post_id)
    doc.set(data)
    return jsonify(data)


@app.route("/update_user/<uid>", methods=["POST"])
def update_user(uid):
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.set(data)
    return jsonify(data)


@app.route("/delete_post/<post_id>", methods=["POST"])
def delete_post(post_id):
    data = request.get_json()
    doc = db.collection("posts").document(post_id)
    doc.delete()
    return jsonify(data)


@app.route("/delete_user/<uid>", methods=["POST"])
def delete_user(uid):
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.delete()
    return jsonify(data)
