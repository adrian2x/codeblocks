from server.firebase import db


class Post:
    def __init__(self, pid) -> None:
        self.pid = pid

    def get(self):
        "Get a post document"
        return db.collection("posts").document(self.pid).get()

    def update(self, data):
        "Update a post document"
        db.collection("posts").document(self.pid).update(data)
        return db.collection("posts").document(self.pid).get()

    def delete(self):
        "Delete a post document"
        db.collection("posts").document(self.pid).delete()
        return {"message": "Post deleted successfully."}
