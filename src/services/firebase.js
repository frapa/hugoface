import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN3trqad0rS25xqKvi1YxVd5v_LA8dlvo",
  authDomain: "hugoface-fd551.firebaseapp.com",
  projectId: "hugoface-fd551",
  storageBucket: "hugoface-fd551.appspot.com",
  messagingSenderId: "898075187762",
  appId: "1:898075187762:web:4f33d0ff130e8e9c29fa2b",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
