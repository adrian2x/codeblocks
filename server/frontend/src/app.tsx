import { useState, useEffect, useRef } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { firebase, FirebaseAuth, showDialog } from './components/FirebaseAuth'
import { user } from './stores/uiState'

function Navbar() {
  return (
    <>
      <nav class='nav'>
        <div class='nav-start'>
          <a class='brand'>Codeblocks</a>
          <a class='active'>Link 1</a>
          <a>Link 2</a>
        </div>
        <div class='nav-end'>
          <UserMenu user={user.value} />
        </div>
      </nav>
      <FirebaseAuth />
    </>
  )
}

function UserMenu({ user }: { user: firebase.User | null }) {
  if (user) {
    return (
      <>
        <button
          className='outline'
          onClick={() => {
            firebase.auth().signOut()
          }}>
          Sign out
        </button>
      </>
    )
  }

  return (
    <>
      <a href='' onClick={() => showDialog()}>
        Sign in
      </a>
      <button className='primary' onClick={() => showDialog()}>
        Sign up
      </button>
    </>
  )
}

export function App() {
  return (
    <div>
      <Navbar />
      <main className='container'>
        <CodeEditor />
      </main>
    </div>
  )
}
