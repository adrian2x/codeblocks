from flask import Blueprint, request, jsonify
from server.firebase import db
from server.posts.posts import get_by_user_id

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/", methods=["POST"])
def create_user():
    "Create a user"
    data = request.get_json()
    doc = db.collection("users").document()
    doc.set(data)
    return jsonify(doc.get().to_dict())


@users_blueprint.route("/<uid>", methods=["GET"])
def read_user(uid):
    "Retrieve user by user id"
    user = db.collection("users").document(uid).get().to_dict()
    posts = get_by_user_id(uid)
    return jsonify({"user": user, "posts": posts})


@users_blueprint.route("/<uid>", methods=["POST"])
def update_user(uid):
    "Update user by user id"
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.update(data)
    return jsonify(data)


@users_blueprint.route("/<uid>", methods=["DELETE"])
def delete_user(uid):
    "Delete user by user id"
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.delete()
    return jsonify(data)
