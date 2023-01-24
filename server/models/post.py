# pylint: disable=no-member
from server.firebase import db, firestore


class Post:
    "Post model class"

    def __init__(self, pid: str = None) -> None:
        self.doc = db.collection("posts").document(pid)

    @staticmethod
    def get_posts_by_user_id(
        uid: str = "", cursor="", language: str = "", limit: int = 10
    ):
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

    @staticmethod
    def get_saved_posts_by_user_id(uid: str, cursor=None, limit: int = 10):
        "Retrieve all posts saved by a user id"
        posts = db.collection("user_posts").document(uid).collection("saved")

        # Sort by created at
        posts = posts.order_by("created", direction=firestore.Query.DESCENDING)

        # Set the page offset
        if cursor:
            pagination_doc = (
                db.collection("user_posts")
                .document(uid)
                .collection("saved")
                .document(cursor)
                .get()
            )
            posts = posts.start_after(pagination_doc)

        posts = posts.limit(limit).stream()
        return [post.to_dict() for post in posts]

    def get(self):
        "Get a post document"
        return self.doc.get()

    def update(self, data: dict):
        "Update a post document"
        self.doc.update(data)
        return self.doc.get()

    def delete(self):
        "Delete a post document"
        self.doc.delete()
        return self

    def save(self, uid: str):
        "Save a post document"
        doc = (
            db.collection("user_posts")
            .document(uid)
            .collection("saved")
            .document(self.doc.id)
        )
        doc.set({"id": self.doc.id})
        return self

    def unsave(self, uid: str):
        "Save a post document"
        doc = (
            db.collection("user_posts")
            .document(uid)
            .collection("saved")
            .document(self.doc.id)
        )
        doc.delete()
        return self

    def get_link(self):
        return f"/posts/{self.doc.id}"

    @staticmethod
    def preview_url(post_id: str):
        return f"https://firebasestorage.googleapis.com/v0/b/codeblocks-991a2.appspot.com/o/{post_id}.png?alt=media"

    def get_preview(self):
        return Post.preview_url(self.doc.id)
