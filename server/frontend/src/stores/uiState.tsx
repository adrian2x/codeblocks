import { signal } from '@preact/signals'
import { app, firebase } from '../common/firebase'

const getUser = () => {
  let saved = localStorage.getItem('user')
  if (saved != null && saved != 'null') return JSON.parse(saved)
  return firebase.auth().currentUser
}

export const user = signal(getUser())

// Handle firebase auth events
app.auth().onAuthStateChanged((signedInUser) => {
  if (signedInUser) {
    // User is signed in
    console.log('signed in', signedInUser)
    // Generate a new auth token for requests
    firebase
      .auth(app)
      .currentUser?.getIdToken()
      .then((token) => {
        localStorage.setItem('token', token)
        localStorage.setItem(
          'user',
          JSON.stringify({
            uid: signedInUser.uid,
            displayName: signedInUser.displayName,
            photoURL: signedInUser.photoURL
          })
        )
        // Update the ui state with the user
        user.value = signedInUser
        console.log('session saved')
      })
  } else {
    // User is signed out, close session.
    console.log('signed out')
    localStorage.removeItem('user')
    // Update the ui state with the user
    user.value = null
  }
})
