import { Params } from 'react-router-dom'
import { firebase } from './common/firebase'

export type RouteProps = {
  params: Params<string>
}

export type FirebaseUser = firebase.User | null

export interface TPost {
  id: string
  title: string
  description: string
  created: number
  code: string
  windowTitle?: string
  language: string
  theme: string
  user: {
    id: string
    uid: string
    displayName: string
    displayHandle: string
    photoUrl: string | null
  }
  preview?: string
}

export type TUser = {
  id: string
  photoUrl: string
  photoURL: string
  displayName: string
  displayHandle: string
  backgroundColor?: string
  about?: string
}
