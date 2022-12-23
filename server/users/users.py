from flask import Blueprint, request, jsonify
from server.firebase import db
from server.posts.posts import get_by_user_id
import random
from pyug import get_random_username

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/", methods=["POST"])
def create_user():
    "Create a user"
    data = request.get_json()
    doc_ref = db.collection("users").document(data.get("id"))

    if not doc_ref.get().exists:
        # DONE: generate new username
        try:
            email = data.get("email")
            print(email)
            username = email.split("@")[0]
        except:
            username = get_random_username() + str(random.randrange(1000))
            print(username)
        data.update("displayHandle", username)  # set this to the username

    doc_ref.update(data)
    doc = doc_ref.get().to_dict()
    # return the updated document
    return jsonify(doc)


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
    # return the updated document
    updated_doc = doc.get().to_dict()
    return jsonify(updated_doc)


@users_blueprint.route("/<uid>", methods=["DELETE"])
def delete_user(uid):
    "Delete user by user id"
    data = request.get_json()
    doc = db.collection("users").document(uid)
    doc.delete()
    return jsonify(data)
