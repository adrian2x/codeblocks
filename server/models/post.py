from server.firebase import db


class Post:
    def __init__(self, pid: str) -> None:
        self.doc = db.collection("posts").document(pid)

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
        return {"message": "Post deleted successfully."}
