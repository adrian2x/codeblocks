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
  if (user) {
    return (
      <>
        <NavLink to={`/post`}>Create</NavLink>
        <NavLink to={`/@/${user.uid}`}>Profile</NavLink>
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
