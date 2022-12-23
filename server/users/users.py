from flask import Blueprint, render_template, request, jsonify
from server.firebase import db, firestore

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/", methods=["POST"])
def users():
    "Create a user"
    data = request.get_json()
    doc = db.collection("posts").document()
    doc.set(data)
    return jsonify(data)


@users_blueprint.route("/<uid>", methods=["GET"])
def read_user(uid):
    "Retrieve user by user id"
    user = db.collection("users").document(uid).get().to_dict()
    return jsonify(user)


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
