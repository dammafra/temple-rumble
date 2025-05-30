import { initializeApp } from 'firebase/app'

const config = {
  apiKey: 'AIzaSyAp54rc0mJE2qdTFrdhsnUAPDSxOdT1jGQ',
  authDomain: 'temple-rumble-75686.firebaseapp.com',
  projectId: 'temple-rumble-75686',
  storageBucket: 'temple-rumble-75686.firebasestorage.app',
  messagingSenderId: '580013751915',
  appId: '1:580013751915:web:4a7192fe5f33ac02ed7b2e',
}

export default class FirebasApp {
  static instance = initializeApp(config)
}
