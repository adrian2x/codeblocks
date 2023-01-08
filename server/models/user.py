from server.firebase import db, auth, firestore


class User:
    def __init__(self, uid: str) -> None:
        self.doc = db.collection("users").document(uid)

    @staticmethod
    def delete_firebase_user(uid: str = ""):
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

    @staticmethod
    def get_user_by_id_handle(uid: str):
        "Find user by uid or handle"
        user = db.collection("users").document(uid).get()
        # Check if uid is a handle name
        if not user.exists:
            query = (
                db.collection("users")
                .where("displayHandle", "==", uid)
                .limit(1)
                .stream()
            )
            user = next(query)
        return user

    def get(self):
        "Get a user document"
        return self.doc.get()

    def update(self, data: dict):
        "Update a user document"
        self.doc.update(data)
        return self.doc.get()

    def delete(self):
        "Delete a user document"
        self.doc.delete()
        return {"message": "User deleted successfully."}
