import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { currentUser } from '../stores/uiState'
import { createUser } from './requests'

firebase.initializeApp({
  apiKey: 'AIzaSyCiG1NWj4_fIo8B22HW2IGc-9BjJFgb6bU',
  authDomain: 'codeblocks-991a2.firebaseapp.com',
  projectId: 'codeblocks-991a2',
  storageBucket: 'codeblocks-991a2.appspot.com',
  messagingSenderId: '937268795675',
  appId: '1:937268795675:web:8f0abdec6267abe2f4dbbe',
  measurementId: 'G-S9928XTV4P'
})

export { firebase }

// Handle firebase auth events
firebase.auth().onAuthStateChanged((signedInUser) => {
  if (signedInUser) {
    // User is signed in
    console.log('onAuthStateChanged', signedInUser)
    // Generate a new auth token for requests
    firebase
      .auth()
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
        currentUser.value = signedInUser
        console.log('session saved')
      })
  } else {
    // User is signed out, close session.
    console.log('signed out')
    localStorage.removeItem('user')
    // Update the ui state with the user
    currentUser.value = null
  }
})

export async function updateCurrentUser(data: any) {
  let authUser = currentUser.value
  if (authUser) {
    await firebase.auth().currentUser?.updateProfile(data)
    currentUser.value = firebase.auth().currentUser
  }
}
