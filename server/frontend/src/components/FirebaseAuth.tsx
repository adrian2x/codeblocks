import { firebase } from '../common/firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export class FirebaseAuth extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `<dialog id='firebase-auth'>
    <form method='dialog'>
      <button value='cancel'>Close</button>
    </form>
  </dialog>`
  }

  connectedCallback() {
    // Initialize the FirebaseUI Widget using Firebase.
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    let data = null
    // Hold a reference to the anonymous current user.
    let anonymousUser = firebase.auth().currentUser

    // The start method will wait until the DOM is loaded.
    ui.start(`#firebase-auth`, {
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      // signInSuccessUrl: '',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true
        }
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      // tosUrl: '<your-tos-url>',
      // Privacy policy url.
      // privacyPolicyUrl: '<your-privacy-policy-url>',
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          console.log('authResult', authResult)
          const user = authResult.user
          console.log('user received', user)
          localStorage.setItem(
            'user',
            JSON.stringify({
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          )
          let dialog = document.getElementById('firebase-auth') as HTMLDialogElement
          dialog.close()
          return false
        },
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        signInFailure: function (error) {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code == 'firebaseui/anonymous-upgrade-merge-conflict') {
            // The credential the user tried to sign in with.
            let cred = error.credential
            // Copy data from anonymous user to permanent user and delete anonymous
            // user.
            // ...
            // Finish sign-in after data is copied.
            firebase.auth().signInWithCredential(cred)
          }
          console.error(error)
        },
        uiShown: () => {
          // The widget is rendered.
          // Hide the loader.
          let user = localStorage.getItem('user')
          if (!user) {
            let dialog = document.getElementById('firebase-auth') as HTMLDialogElement
            dialog.showModal()
          }
        }
      }
    })
  }
}

customElements.define('firebase-auth', FirebaseAuth)
