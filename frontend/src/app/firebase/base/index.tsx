import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/database';

import config from "app/config";

const app = firebase.initializeApp(config.firebaseConfig);
export let firebaseFunctions = app.functions();

export const fs = app.firestore();
export const db = app.database();
export default app;