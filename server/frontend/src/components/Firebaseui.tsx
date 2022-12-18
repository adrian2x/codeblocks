import { firebase } from '../common/firebase'
import * as firebaseui from 'firebaseui'
import { createRef } from 'preact'
import { useEffect } from 'preact/hooks'
import 'firebaseui/dist/firebaseui.css'

export function SigninDialog() {
  const element = 'firebaseui-auth-container'

  const showDialog = (id: string) => {
    let dialog = document.getElementById(id) as HTMLDialogElement
    dialog.showModal()
  }

  useEffect(() => {
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth())

    var data = null
    // Hold a reference to the anonymous current user.
    var anonymousUser = firebase.auth().currentUser

    // The start method will wait until the DOM is loaded.
    ui.start(`#${element}`, {
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      // signInSuccessUrl: '',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
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
          return false
        },
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        signInFailure: function (error) {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code == 'firebaseui/anonymous-upgrade-merge-conflict') {
            // The credential the user tried to sign in with.
            var cred = error.credential
            // Copy data from anonymous user to permanent user and delete anonymous
            // user.
            // ...
            // Finish sign-in after data is copied.
            firebase.auth().signInWithCredential(cred)
          }
          console.error(error)
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          showDialog(element)
        }
      }
    })
  }, [])

  return (
    <dialog id={element}>
      <form method='dialog'>
        <button value='cancel'>Close</button>
      </form>
    </dialog>
  )
}
