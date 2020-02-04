import * as functions from 'firebase-functions';
import { getAccessToken, /*getSubreddits, formatSubreddits,*/ getUserInfo } from './helpers';
import * as admin from 'firebase-admin';

admin.initializeApp()
const firestore = admin.firestore()

interface submitUserLogin_i {
    code: string
}

exports.submitUserLogin = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken
        let refreshToken
        let userInfo
        let USERNAME

        console.log("ADDING USER TOKEN")
        console.log("GETTING ACCESS TOKEN AND REFRESH TOKEN")
        try {
            ({ refreshToken, accessToken } = await getAccessToken(data.code, functions.config().reddit.clientid, functions.config().reddit.secret))
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN", err)
            res({ ok: false, message: "error getting access token" })
            return
        }
        console.log(accessToken)
        console.log(refreshToken)

        console.log("GETTING USERNAME")
        try {
            userInfo = await getUserInfo(accessToken)
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err)
            res({ ok: false, message: "error getting user identity" })
            return
        }

        USERNAME = userInfo.name
        console.log("ADDING TO FIRESTORE DB")
        await firestore.collection("users").doc(USERNAME).set({
            timestamp: new Date().getTime(),
            refreshToken,
        })
        
        res({ ok: true, message: "success" })
    })
})

exports.deleteUserInfo = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken
        let userInfo
        let USERNAME

        console.log("DELETING USER INFO")
        console.log("GETTING ACCESS TOKEN")
        try {
            ({ accessToken } = await getAccessToken(data.code, functions.config().reddit.clientid, functions.config().reddit.secret))
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN", err)
            res({ ok: false, message: "error getting access token" })
            return
        }
        console.log(accessToken)

        console.log("GETTING USERNAME")
        try {
            userInfo = await getUserInfo(accessToken)
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err)
            res({ ok: false, message: "error getting user identity" })
            return
        }

        USERNAME = userInfo.name
        console.log("DELETING USER FROM FIRESTORE DB")
        await firestore.collection("users").doc(USERNAME).delete()
        
        res({ ok: true, message: "success" })
    })
})