import { signal } from '@preact/signals'
import { firebase } from '../common/firebase'

const getUser = () => {
  let saved = localStorage.getItem('user')
  if (saved != null && saved != 'null') return JSON.parse(saved) as firebase.User
  return firebase.auth().currentUser
}

export const currentUser = signal(getUser())
