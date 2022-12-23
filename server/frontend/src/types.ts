import { Params } from 'react-router-dom'
import { firebase } from './common/firebase'

export type RouteProps = {
  params: Params<string>
}

export type FirebaseUser = firebase.User | null
