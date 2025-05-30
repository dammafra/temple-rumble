import { getAuth, signInAnonymously } from 'firebase/auth'
import FirebasApp from './app'

export default class Auth {
  static init() {
    Auth.instance = getAuth(FirebasApp.instance)
    signInAnonymously(Auth.instance)
  }
}
