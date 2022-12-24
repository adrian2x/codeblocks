import firebase_admin
from firebase_admin import credentials, firestore, auth

# Exports the firebase app
firebase = firebase_admin.initialize_app(credentials.Certificate("server/key.json"))

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
