from server.firebase import db


class User:
    def __init__(self, uid: str) -> None:
        self.doc = db.collection("users").document(uid)

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
