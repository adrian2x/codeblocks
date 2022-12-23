from flask import Blueprint, request, jsonify
from server.firebase import db
from server.posts.posts import get_by_user_id
import random
from pyug import get_random_username

users_blueprint = Blueprint("users", __name__)


def generate_username(email: str = None):
    "Create a username from the email"
    denumerator = str(random.randrange(1000))
    try:
        username = email.split("@")[0] + denumerator
    except:
        username = get_random_username() + denumerator
    return username


@users_blueprint.route("/", methods=["POST"])
def create_user():
    "Create a user"
    data = request.get_json()
    doc_ref = db.collection("users").document(data.get("id"))
    snapshot = doc_ref.get()

    if not snapshot.exists or data.get("displayHandle") is None:
        # generate new username
        username = generate_username(data.get("email"))
        data.update({"displayHandle": username})

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
