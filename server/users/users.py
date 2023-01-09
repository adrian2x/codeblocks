from flask import Blueprint, request, jsonify
from server.firebase import db
from server.models.user import User
from server.models.post import Post

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/", methods=["POST"])
def create_user():
    "Create a user"
    data = request.get_json()
    doc_ref = db.collection("users").document(data.get("id"))
    snapshot = doc_ref.get()

    if not snapshot.exists or snapshot.get("displayHandle") is None:
        # generate new username
        username = User.generate_username(data.get("email"))
        data.update({"displayHandle": username})

    doc_ref.set(data, merge=True)
    doc = doc_ref.get().to_dict()
    # return the updated document
    return jsonify(doc)


@users_blueprint.route("/<uid>", methods=["GET"])
def read_user(uid: str):
    "Retrieve user by user id"
    user = User.get_user_by_id_handle(uid)
    posts = Post.get_posts_by_user_id(user.id)
    return jsonify({"user": user.to_dict(), "posts": posts})


@users_blueprint.route("/<uid>", methods=["POST"])
def update_user(uid):
    "Update user by user id"
    data = request.get_json()
    # return the updated document
    updated_doc = User(uid).update(data).to_dict()
    return jsonify(updated_doc)


@users_blueprint.route("/<uid>", methods=["DELETE"])
def delete_user(uid):
    "Delete user by user id"
    User.delete_firebase_user(uid)
    return jsonify(ok=True)
