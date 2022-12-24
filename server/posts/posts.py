from flask import Blueprint, render_template, request, jsonify
from server.firebase import db, firestore

posts_blueprint = Blueprint("posts", __name__)


@posts_blueprint.route("/", methods=["POST"])
def posts():
    "Create a post"
    data = request.get_json()
    doc = db.collection("posts").document()
    doc.set(data)
    doc.update({"id": doc.id})
    return jsonify(doc.get().to_dict())


def get_by_user_id(uid="", cursor="", limit=10):
    "Retrieve all posts created by a user id"
    posts = db.collection("posts")

    # Filter by user id
    if uid:
        posts = posts.where("user.uid", "==", uid)

    # Sort by created at
    posts = posts.order_by("created", direction=firestore.Query.DESCENDING)

    # Set the page offset
    if cursor:
        pagination_doc = db.collection("posts").document(cursor).get()
        posts = posts.start_after(pagination_doc)

    posts = posts.limit(limit).stream()
    return [post.to_dict() for post in posts]


@posts_blueprint.route("/", methods=["GET"])
def read_posts_uid():
    "Retrieve all posts created by a user id"
    uid = request.args.get("uid")
    cursor = request.args.get("cursor")
    results = get_by_user_id(uid, cursor)
    return jsonify(results)


@posts_blueprint.route("/<post_id>", methods=["GET"])
def read_post(post_id):
    "Retrieve post by post id"
    post = db.collection("posts").document(post_id).get().to_dict()
    return jsonify(post)


@posts_blueprint.route("/<post_id>", methods=["POST"])
def update_post(post_id):
    "Update post by post id"
    data = request.get_json()
    doc = db.collection("posts").document(post_id)
    doc.update(data)
    updated_doc = db.collection("posts").document(post_id).get().to_dict()
    return jsonify(updated_doc)


@posts_blueprint.route("/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    "Delete post by post id"
    doc = db.collection("posts").document(post_id)
    doc.delete()
    return jsonify({"message": "Post deleted successfully."})
