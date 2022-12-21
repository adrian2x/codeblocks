import { Link, Outlet } from 'react-router-dom'
import { firebase, FirebaseAuth, showDialog } from './components/FirebaseAuth'
import { user } from './stores/uiState'

function Navbar() {
  return (
    <>
      <nav class='nav'>
        <div class='nav-start'>
          <Link class='brand' to={`/`}>
            Codeblocks
          </Link>
          <Link to={`/posts`}>Posts</Link>
          <Link to={`/post`}>
            <button class='primary'>Create new</button>
          </Link>
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
        <Link to={`/users/${user.uid}`}>My profile</Link>
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
      <div>
        <Outlet />
      </div>
    </div>
  )
}
