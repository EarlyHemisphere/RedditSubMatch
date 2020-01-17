import * as functions from 'firebase-functions';
import { getAccessToken, getSubreddits, formatSubreddits, getUserInfo, formatUserInfo } from './helpers';
import * as admin from 'firebase-admin';



admin.initializeApp() 
const firestore = admin.firestore()


interface submitUserLogin_i {
    code: string
}


exports.submitUserLogin = functions.https.onCall(async (data: submitUserLogin_i, context) => {
    return new Promise(async (res, rej) => {
        let accessToken
        let subreddits
        let userInfo
        let USERNAME

        try {
            accessToken = await getAccessToken(data.code)
        } catch{
            res({ ok: false, message: "error getting access token" })
            return
        }
        try {
            userInfo = await getUserInfo(accessToken)
        } catch{
            res({ ok: false, message: "error getting user identity" })
            return
        }
        // could check the db here in order to make sure the user hasn't done it twice
        // althought I'm not sure if its that important 
        try {
            subreddits = await getSubreddits(accessToken)
        } catch{
            res({ ok: false, message: "error getting subreddits" })
            return
        }


        USERNAME = userInfo.name
        
        // take the list of subreddits and add it to a database
        firestore.collection("users").doc(USERNAME).set({
            timestamp: new Date().getTime(),
            userInfo: formatUserInfo(userInfo),
            subreddits: formatSubreddits(subreddits)
        })
        
        res({ ok: true, message: "success" })
    })
})



// exports.match = functions.pubsub