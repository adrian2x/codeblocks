# pylint: disable=no-member
"""Posts Blueprint"""
from flask import Blueprint, request, jsonify
from server.firebase import db
from server.models.post import Post

posts_blueprint = Blueprint("posts", __name__)


@posts_blueprint.route("/", methods=["POST"])
def create_post():
    "Create a post"
    data = request.get_json()
    doc = db.collection("posts").document()
    data.update(id=doc.id)
    doc.set(data)
    return jsonify(doc.get().to_dict())


@posts_blueprint.route("/", methods=["GET"])
def get_posts():
    "Retrieve all posts created by a user id"
    uid = request.args.get("uid")
    cursor = request.args.get("cursor")
    language = request.args.get("language")
    results = Post.get_posts_by_user_id(uid, cursor, language)
    return jsonify(results)


@posts_blueprint.route("/<post_id>", methods=["GET"])
def read_post(post_id):
    "Retrieve post by post id"
    post = Post(post_id).get().to_dict()
    return jsonify(post)


@posts_blueprint.route("/<post_id>", methods=["POST"])
def update_post(post_id):
    "Update post by post id"
    data = request.get_json()
    updated_doc = Post(post_id).update(data).to_dict()
    return jsonify(updated_doc)


@posts_blueprint.route("/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    "Delete post by post id"
    Post(post_id).delete()
    return jsonify(ok=True)


@posts_blueprint.route("/save/<post_id>/<user_id>", methods=["POST"])
def save_post(post_id, user_id):
    "Save a post"
    post = Post(post_id)
    status = request.get_json().get("status")
    if status:
        post.save(user_id)
    else:
        post.unsave(user_id)
    return jsonify(saved=status)
