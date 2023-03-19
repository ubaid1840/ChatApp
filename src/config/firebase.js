// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkGgYoKdGOiq75-yOEDrkcwTreQRIE44Y",
  authDomain: "myapp-9573d.firebaseapp.com",
  projectId: "myapp-9573d",
  storageBucket: "myapp-9573d.appspot.com",
  messagingSenderId: "402894841985",
  appId: "1:402894841985:web:2a71ca6423bbe260138580",
  measurementId: "G-10GSKTC21N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default app