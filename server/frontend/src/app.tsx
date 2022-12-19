import { useState, useEffect, useRef } from 'react'
import { CodeEditor } from './components/CodeEditor'
import './components/FirebaseAuth'

function Navbar() {
  return (
    <nav class='nav'>
      <div class='nav-start'>
        <a class='brand'>Codeblocks</a>
        <a class='active'>Link 1</a>
        <a>Link 2</a>
      </div>
      <div class='nav-end'>
        <a href=''>Sign in</a>
        <button className='primary'>Sign up</button>
      </div>
    </nav>
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
