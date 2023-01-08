import { useEffect } from 'preact/hooks'
import { currentUser } from '../stores/uiState'
import { firebase } from '../common/firebase'
import 'firebaseui/dist/firebaseui.css'
import { createUser } from '../common/requests'

export { showDialog, closeDialog }

export function FirebaseAuth() {
  useEffect(onRender, [])
  return (
    <dialog id='firebaseAuthDialog'>
      <form method='dialog'>
        <div className='flex flex-row-reverse'>
          <button class='clear p0 m0' value='cancel'>
            <div>✕</div>
          </button>
        </div>
        <div id='firebase-auth-ui'></div>
      </form>
    </dialog>
  )
}

function showDialog(id = 'firebaseAuthDialog') {
  let dialog = document.getElementById(id)
  return (dialog as HTMLDialogElement).showModal()
}

function closeDialog(id = 'firebaseAuthDialog') {
  let dialog = document.getElementById(id)
  return (dialog as HTMLDialogElement).close()
}

function onRender() {
  // Initialize the FirebaseUI Widget using Firebase.
  import('firebaseui').then((firebaseui) => {
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    let data = null
    // Hold a reference to the anonymous current user.
    let anonymousUser = firebase.auth().currentUser

    // The start method will wait until the DOM is loaded.
    ui.start(`#firebase-auth-ui`, {
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
        signInSuccessWithAuthResult(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          closeDialog()
          const user = authResult.user
          const credential = authResult.credential
          const isNewUser = authResult.additionalUserInfo.isNewUser
          const providerId = authResult.additionalUserInfo.providerId
          const operationType = authResult.operationType
          if (isNewUser) {
            createUser({
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              created: Date.now()
            })
          }
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
        signInFailure(error) {
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
        uiShown() {
          // The widget is rendered.
          // Hide the loader.
          if (!currentUser.value) showDialog()
        }
      }
    })
  })
}
