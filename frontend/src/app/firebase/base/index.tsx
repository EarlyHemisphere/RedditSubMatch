import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';

import config from "app/config";

const app = firebase.initializeApp(config.firebaseConfig);
export let firebaseFunctions = app.functions();

export const db = app.firestore();
export default app;