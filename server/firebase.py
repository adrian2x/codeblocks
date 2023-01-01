from firebase_admin import initialize_app, firestore, auth

# Exports the firebase app
firebase = initialize_app()

# Exports the firestore client
db = firestore.client()


def delete_firebase_user(uid=""):
    "Delete a user and associated data"
    # First, delete the user login. If this fails, no need to continue
    auth.delete_user(uid)

    doc = db.collection("users").document(uid)
    doc.delete()

    # delete the user posts in a batch operation
    batch = db.batch()
    posts = db.collection("posts").where("user.uid", "==", uid).get()
    for post in posts:
        batch.delete(post.reference)
    batch.commit()


def get_user_by_id_handle(user_id: str):
    "Find user by uid or handle"
    user = db.collection("users").document(user_id).get()
    # Check if user_id is a handle name
    if not user.exists:
        query = db.collection("users").where("displayHandle", "==", user_id).limit(1).stream()
        user = next(query)
    return user


def get_posts_by_user_id(uid="", cursor="", language="", limit=10):
    "Retrieve all posts created by a user id"
    posts = db.collection("posts")

    # Filter by user id
    if uid:
        posts = posts.where("user.uid", "==", uid)

    # Filter by code language
    if language:
        posts = posts.where("language", "==", language)

    # Sort by created at
    posts = posts.order_by("created", direction=firestore.Query.DESCENDING)

    # Set the page offset
    if cursor:
        pagination_doc = db.collection("posts").document(cursor).get()
        posts = posts.start_after(pagination_doc)

    posts = posts.limit(limit).stream()
    return [post.to_dict() for post in posts]
