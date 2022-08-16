// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCt6YNeGxzBzJFo42aGWsUv1t6TOQVklIo',
  authDomain: 'school-administration-c558d.firebaseapp.com',
  projectId: 'school-administration-c558d',
  storageBucket: 'school-administration-c558d.appspot.com',
  messagingSenderId: '320945517532',
  appId: '1:320945517532:web:c115a08b4fae197a0e9519',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// database
export const db = getFirestore(app);

export const storage = getStorage(app);
