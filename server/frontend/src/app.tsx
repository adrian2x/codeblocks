import { useState, useEffect } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import { SigninDialog } from './components/Firebaseui'

function Navbar() {
  return (
    <nav class='nav mb4'>
      <div class='nav-start'>
        <a class='brand'>Codeblocks</a>
        <a class='active'>Link 1</a>
        <a>Link 2</a>
      </div>
      <div class='nav-end'>
        <a>Sign in</a>
        <a>Sign up</a>
      </div>
    </nav>
  )
}

export function App() {
  return (
    <div>
      <Navbar />

      <SigninDialog />

      <main className='container'>
        <PostCreate />
      </main>
    </div>
  )
}

export function PostCreate() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')

  const onSubmit = () => {
    console.log('update', title, description, code)
  }

  return (
    <div class='post-form'>
      <div>
        <div>
          <h4>
            <input
              class='clear'
              type='text'
              placeholder='Title'
              onInput={(e) => setTitle(e.currentTarget.value)}
            />
          </h4>
        </div>
        <div>
          <textarea
            class='clear'
            placeholder='Add a nice description'
            onInput={(e) => setDescription(e.currentTarget.value)}></textarea>
        </div>

        <div className='code-background'>
          <div class='code-window'>
            <div className='flex buttons'>
              <div className='btn-1'></div>
              <div className='btn-2'></div>
              <div className='btn-3'></div>
            </div>
            <textarea
              placeholder='Code ...'
              rows={8}
              wrap='off'
              onInput={(e) => setCode(e.currentTarget.value)}></textarea>
          </div>
        </div>
      </div>

      <div>
        <button onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}
