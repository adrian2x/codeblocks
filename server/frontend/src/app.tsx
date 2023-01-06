import { Link, NavLink, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FirebaseAuth, showDialog } from './components/FirebaseAuth'
import { currentUser } from './stores/uiState'
import { firebase } from './common/firebase'
import { Dropdown } from './components/Dropdown'
import { RxHamburgerMenu } from 'react-icons/rx'

function Navbar() {
  return (
    <>
      <nav class='nav'>
        <div class='nav-start'>
          <NavLink className='brand' to={`/`}>
            Codeblocks
          </NavLink>
        </div>
        <div class='nav-end sm-hide'>
          <UserMenu user={currentUser.value} />
        </div>
        <div class='nav-end md-hide'>
          <Dropdown
            target={
              <button class='outline icon-only'>
                <RxHamburgerMenu />
              </button>
            }>
            <div className='flex flex-column'>
              <UserMenu user={currentUser.value} />
            </div>
          </Dropdown>
        </div>
      </nav>
      <FirebaseAuth />
    </>
  )
}

function UserMenu({ user }: { user: any }) {
  return user != null ? (
    <button className='outline' onClick={() => firebase.auth().signOut()}>
      Sign out
    </button>
  ) : (
    <button className='round primary' onClick={() => showDialog()}>
      Sign up
    </button>
  )
}

export function App() {
  return (
    <div id='app'>
      <Toaster />
      <Navbar />
      <main className='flex' style={{ paddingTop: '4rem' }}>
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
