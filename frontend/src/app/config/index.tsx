const dev = {
  firebaseConfig: {
    apiKey: "AIzaSyCGHukG5nAfFCJ5ys9IZJlb2Unc4iXliis",
    authDomain: "reddit-submatch.firebaseapp.com",
    databaseURL: "https://reddit-submatch.firebaseio.com",
    projectId: "reddit-submatch",
    storageBucket: "reddit-submatch.appspot.com",
    messagingSenderId: "1049385497166",
    appId: "1:1049385497166:web:8a6ee4c65e43d9577ac91f",
    measurementId: "G-XWD2LG9PFV"
  }
};

export const mode = 'prod'

const prod = dev;

const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  ...config
};

