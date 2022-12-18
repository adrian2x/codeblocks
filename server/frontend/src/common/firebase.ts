import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyCiG1NWj4_fIo8B22HW2IGc-9BjJFgb6bU',
  authDomain: 'codeblocks-991a2.firebaseapp.com',
  projectId: 'codeblocks-991a2',
  storageBucket: 'codeblocks-991a2.appspot.com',
  messagingSenderId: '937268795675',
  appId: '1:937268795675:web:8f0abdec6267abe2f4dbbe',
  measurementId: 'G-S9928XTV4P'
})

export { firebase, app }

// Handle auth events
app.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('signed in', user)
    // User is signed in, get auth token
    firebase
      .auth(app)
      .currentUser?.getIdToken()
      .then((token) => {
        localStorage.setItem('token', token)
        console.log('session saved')
      })
  } else {
    // User is signed out, close session.
    localStorage.removeItem('token')
    console.log('logged out')
  }
})
