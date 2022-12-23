import { User } from 'firebase/auth'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { auth } from './common/firebase'
import { FirebaseAuth, showDialog } from './components/FirebaseAuth'
import { user } from './stores/uiState'

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
          <UserMenu user={user.value} />
        </div>
      </nav>
      <FirebaseAuth />
    </>
  )
}

function UserMenu({ user }: { user: User | null }) {
  if (user) {
    return (
      <>
        <Link to={`/users/${user.uid}`}>My profile</Link>
        <button
          className='outline'
          onClick={() => {
            auth.signOut()
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
      <div class='p4'>
        <Outlet />
      </div>
    </div>
  )
}
