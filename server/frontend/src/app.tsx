import { Link, NavLink, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FirebaseAuth, showDialog } from './components/FirebaseAuth'
import { currentUser } from './stores/uiState'
import { firebase } from './common/firebase'

function Navbar() {
  return (
    <>
      <nav class='nav'>
        <div class='nav-start'>
          <NavLink className='brand' to={`/`}>
            Codeblocks
          </NavLink>
          <NavLink to={`/post`}>Create new</NavLink>
        </div>
        <div class='nav-end'>
          <UserMenu user={currentUser.value} />
        </div>
      </nav>
      <FirebaseAuth />
    </>
  )
}

function UserMenu({ user }: { user: any }) {
  if (user) {
    return (
      <>
        <Link to={`/@/${user.uid}`}>My profile</Link>
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
      <button className='primary radius-4' onClick={() => showDialog()}>
        Sign up
      </button>
    </>
  )
}

export function App() {
  return (
    <div>
      <Toaster />
      <Navbar />
      <Outlet />
    </div>
  )
}
