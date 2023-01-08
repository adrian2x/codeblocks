import { Link, NavLink, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FirebaseAuth, showDialog } from './components/FirebaseAuth'
import { currentUser } from './stores/uiState'
import { firebase } from './common/firebase'
import { Dropdown } from './components/Dropdown'
import { FaBars } from 'react-icons/fa'

function Navbar() {
  return (
    <div>
      <FirebaseAuth />
      <nav class='nav'>
        <div className='max-width flex flex-1 items-baseline'>
          <div class='nav-start'>
            <NavLink className='brand' to={`/`}>
              Codeblocks
            </NavLink>
          </div>
          <div class='nav-end sm-hide'>
            <NavMenu />
          </div>
          <div class='nav-end sm-show'>
            <Dropdown
              css='sm-btn-menu'
              target={
                <button class='outline icon-only'>
                  <FaBars />
                </button>
              }>
              <NavMenu />
            </Dropdown>
          </div>
        </div>
      </nav>
    </div>
  )
}

function NavMenu() {
  if (currentUser.value != null) return <AuthMenu user={currentUser.value} />

  return (
    <>
      <button className='round primary' onClick={() => showDialog()} style={{ minWidth: 100 }}>
        Sign up
      </button>
    </>
  )
}

function AuthMenu({ user }: { user: firebase.User }) {
  return (
    <>
      <div className='sm-hide'>
        <Dropdown
          css='user-menu'
          target={
            <img
              class='avatar drop-shadow-4'
              src={user?.photoURL ?? `https://www.gravatar.com/avatar/?d=mp&s=48`}
              alt={user?.displayName ?? ''}
              referrerpolicy='no-referrer'
            />
          }>
          <Link to={`/@/${user.uid}`}>Hey, {user?.displayName}</Link>
          <Link to={`/@/${user.uid}`}>Profile</Link>
          <Link to={`/settings`}>Settings</Link>
          <Link to={`/`} onClick={() => firebase.auth().signOut()}>
            Sign out
          </Link>
        </Dropdown>
      </div>
      <div className='sm-show'>
        <Link to={`/@/${user.uid}`}>Hey, {user?.displayName}</Link>
        <Link to={`/@/${user.uid}`}>Profile</Link>
        <Link to={`/settings`}>Settings</Link>
        <Link to={`/`} onClick={() => firebase.auth().signOut()}>
          Sign out
        </Link>
      </div>
    </>
  )
}

export function App() {
  return (
    <div id='app'>
      <Toaster />
      <Navbar />
      <main className='flex max-width' style={{ paddingTop: '4rem' }}>
        <aside class='hidden lg-show'>
          <div className='grid grid-col-1 gap-4'>
            <NavLink to={`/`}>Home</NavLink>
            <NavLink to={`/post`}>Explore</NavLink>
            {currentUser.value != null && (
              <>
                <NavLink to={`/saved`}>Saved</NavLink>
                <NavLink to={`/@/${currentUser.value?.uid}`}>Profile</NavLink>
              </>
            )}
            <NavLink to={`/post`}>
              <button className='round primary w-100'>Create</button>
            </NavLink>
          </div>
        </aside>
        <Outlet />
      </main>
    </div>
  )
}
