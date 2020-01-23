import * as functions from 'firebase-functions';
import { getAccessToken, /*getSubreddits, formatSubreddits,*/ getUserInfo } from './helpers';
import * as admin from 'firebase-admin';



admin.initializeApp()
const firestore = admin.firestore()


interface submitUserLogin_i {
    code: string
}


exports.submitUserLogin = functions.https.onCall(async (data: submitUserLogin_i, context) => {
    return new Promise(async (res, rej) => {
        let accessToken
        let refreshToken
        // let subreddits
        let userInfo
        let USERNAME

        console.log("GETTING ACCESS TOKEN AND REFRESH TOKEN")
        try {
            ({ refresh_token: refreshToken, access_token: accessToken } = await getAccessToken(data.code, functions.config().reddit.clientid, functions.config().reddit.secret))
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN", err)
            res({ ok: false, message: "error getting access token" })
            return
        }
        console.log(accessToken)
        console.log(refreshToken)
        console.log("GETTING USER INFO")
        try {
            userInfo = await getUserInfo(accessToken)
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err)
            res({ ok: false, message: "error getting user identity" })
            return
        }

        // console.log("GETTING SUBREDDITS")
        // try {
        //     subreddits = await getSubreddits(accessToken)
        // } catch(err) {
        //     console.error("FAILED GETTING SUBREDDITS", err)
        //     res({ ok: false, message: "error getting subreddits" })
        //     return
        // }

        USERNAME = userInfo.name
        console.log("ADDING TO FIRESTORE DB")
        // take the list of subreddits and add it to a database
        await firestore.collection("users").doc(USERNAME).set({
            timestamp: new Date().getTime(),
            accessToken,
            refreshToken,
            //subreddits: formatSubreddits(subreddits)
        })
        
        res({ ok: true, message: "success" })
    })
})



// exports.match = functions.pubsub