"""Server module"""
from flask import Flask
from flask_talisman import Talisman
from server.posts.posts import posts_blueprint
from server.users.users import users_blueprint
from server.web.web import web_blueprint

csp = {
    "default-src": "'self'",
    "img-src": "*",
    "script-src": "*",
}

app = Flask(__name__)
Talisman(app, content_security_policy=csp)
# This is for Google app engine health check
@app.route("/_ah/warmup")
def warmup():
    "Warmup endpoint"
    # Handle your warmup logic here, e.g. set up a database connection pool
    return "Ready"


app.register_blueprint(web_blueprint, url_prefix="/")
app.register_blueprint(posts_blueprint, url_prefix="/api/posts")
app.register_blueprint(users_blueprint, url_prefix="/api/users")
