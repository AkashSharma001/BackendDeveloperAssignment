const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkv3_JFfwS7gG76N88z4w2m2unRefRv4Q",
  authDomain: "webgallery-8ae33.firebaseapp.com",
  projectId: "webgallery-8ae33",
  storageBucket: "webgallery-8ae33.appspot.com",
  messagingSenderId: "705217286836",
  appId: "1:705217286836:web:0effe81d56f5c63edffde1",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseApp);
