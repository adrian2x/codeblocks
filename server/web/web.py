from flask import Blueprint, render_template
from server.firebase import db
from server.models.user import User
from server.models.post import Post

web_blueprint = Blueprint(
    "web",
    __name__,
    static_url_path="/",
    static_folder="../frontend/dist",
    template_folder="../frontend/dist",
)


@web_blueprint.route("/post/<post_id>")
def get_post(post_id=None):
    "Renders the post html page"
    post = Post(post_id).get()
    data = post.to_dict()
    data.update({"id": post.id})
    return render_template("post.html", post=data)


@web_blueprint.route("/@/<user_id>")
def get_profile(user_id=""):
    "Renders the profile html page"
    user = User.get_user_by_id_handle(user_id)
    return render_template("profile.html", user=user.to_dict())


@web_blueprint.route("/")
@web_blueprint.route("/post")
def catch_all(path=None):
    print("request", path)
    return web_blueprint.send_static_file("index.html")
