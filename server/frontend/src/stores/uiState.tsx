import { signal } from '@preact/signals'
import { User } from 'firebase/auth'
import { firebase } from '../common/firebase'

const getUser = () => {
  let saved = localStorage.getItem('user')
  if (saved != null && saved != 'null') return JSON.parse(saved) as User
  return firebase.auth().currentUser
}

export const currentUser = signal(getUser())
