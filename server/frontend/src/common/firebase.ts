import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

let app = initializeApp({
  apiKey: 'AIzaSyCiG1NWj4_fIo8B22HW2IGc-9BjJFgb6bU',
  authDomain: 'codeblocks-991a2.firebaseapp.com',
  projectId: 'codeblocks-991a2',
  storageBucket: 'codeblocks-991a2.appspot.com',
  messagingSenderId: '937268795675',
  appId: '1:937268795675:web:8f0abdec6267abe2f4dbbe',
  measurementId: 'G-S9928XTV4P'
})

export const auth = getAuth()
