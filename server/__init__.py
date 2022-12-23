from server.firebase import firestore
from flask import Flask, request, jsonify
from server.firebase import db
from server.posts.posts import posts_blueprint
from server.users.users import users_blueprint
from server.web.web import web_blueprint

app = Flask(__name__)

app.register_blueprint(web_blueprint, url_prefix="/")
app.register_blueprint(posts_blueprint, url_prefix="/api/posts")
app.register_blueprint(users_blueprint, url_prefix="/api/users")
