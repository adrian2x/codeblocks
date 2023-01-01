from flask import Flask
from server.posts.posts import posts_blueprint
from server.users.users import users_blueprint
from server.web.web import web_blueprint

app = Flask(__name__)

# This is for Google app engine health check
@app.route("/_ah/warmup")
def warmup():
    # Handle your warmup logic here, e.g. set up a database connection pool
    return "Ready"


app.register_blueprint(web_blueprint, url_prefix="/")
app.register_blueprint(posts_blueprint, url_prefix="/api/posts")
app.register_blueprint(users_blueprint, url_prefix="/api/users")
