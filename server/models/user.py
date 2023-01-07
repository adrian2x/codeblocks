from server.firebase import db


class User:
    def __init__(self, uid) -> None:
        self.uid = uid

    def get(self):
        "Get a user document"
        return db.collection("users").document(self.uid).get()

    def update(self, data):
        "Update a user document"
        db.collection("users").document(self.uid).update(data)
        return db.collection("users").document(self.uid).get()

    def delete(self):
        "Delete a user document"
        db.collection("users").document(self.uid).delete()
        return {"message": "User deleted successfully."}
