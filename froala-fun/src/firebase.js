import * as firebase from 'firebase';
// require('dotenv').config();


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_Key,
  authDomain: process.env.REACT_APP_FB_authDomain,
  databaseURL: process.env.REACT_APP_FB_databaseURL,
  projectId: process.env.REACT_APP_FB_projectId,
  storageBucket: process.env.REACT_APP_FB_storageBucket,
  messagingSenderId: process.env.REACT_APP_FB_messagingSenderId,
  appId: process.env.REACT_APP_FB_appId,
  measurementId: process.env.REACT_APP_FB_measurementId
};

firebase.initializeApp(firebaseConfig);


// Initialize Firebase
export const database = firebase.database();
// firebase.analytics()

// export const editorRef = databaseRef.child("editor")
