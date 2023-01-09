from firebase_admin import initialize_app, firestore, auth

# Exports the firebase app
firebase = initialize_app()

# Exports the firestore client
db = firestore.client()
