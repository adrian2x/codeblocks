from server.firebase import firestore
from flask import Flask, request, jsonify
from server.firebase import db

app = Flask(
    __name__,
    static_url_path="",
    static_folder="frontend/dist",
    template_folder="frontend/dist",
)


@app.route("/api/posts/", methods=["POST"])
def posts():
    "Create a post"
    data = request.get_json()
    doc = db.collection("posts").document()
    doc.set(data)
    doc.update({"id": doc.id})
    return jsonify(doc.get().to_dict())


@app.route("/api/posts/", methods=["GET"])
def read_posts_uid():
    "Retrieve all posts created by a user id"
    posts = db.collection("posts")

    uid = request.args.get("uid")
    if uid:
        posts = posts.where("user_id", "==", uid)

    posts = posts.order_by("created", direction=firestore.Query.DESCENDING).stream()
    list_of_posts = [post.to_dict() for post in posts]

    return jsonify(list_of_posts)


@app.route("/api/posts/<post_id>", methods=["GET"])
def read_post(post_id):
    "Retrieve post by post id"
    post = db.collection("posts").document(post_id).get().to_dict()
    return jsonify(post)


@app.route("/api/posts/<post_id>", methods=["POST"])
def update_post(post_id):
    "Update post by post id"
    data = request.get_json()
    doc = db.collection("posts").document(post_id)
    doc.update(data)
    updated_doc = db.collection("posts").document(post_id).get().to_dict()
    return jsonify(updated_doc)


@app.route("/api/posts/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    "Delete post by post id"
    data = request.get_json()
    doc = db.collection("posts").document(post_id)
    doc.delete()
    return jsonify(data)


@app.route("/api/users/", methods=["POST"])
def users():
    "Create a user"
    data = request.get_json()
    doc = db.collection("posts").document()
    doc.set(data)
    return jsonify(data)


@app.route("/api/users/<uid>", methods=["GET"])
def read_user(uid):
    "Retrieve user by user id"
    user = db.collection("users").document(uid).get().to_dict()
    return jsonify(user)


@app.route("/api/users/<uid>", methods=["POST"])
def update_user(uid):
    "Update user by user id"
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.update(data)
    return jsonify(data)


@app.route("/api/users/<uid>", methods=["DELETE"])
def delete_user(uid):
    "Delete user by user id"
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.delete()
    return jsonify(data)


@app.route("/", defaults={"path": ""})
@app.route("/<string:path>")
@app.route("/<path:path>")
def catch_all(path):
    print("request", path)
    return app.send_static_file("index.html")
