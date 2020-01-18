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
            console.log("GETTING ACCESS TOKEN")
            accessToken = await getAccessToken(data.code, functions.config().reddit.clientid, functions.config().reddit.secret)
        } catch(err){
            console.error("FAILED GETTING ACCESS TOKEN", err)
            res({ ok: false, message: "error getting access token" })
            return
        }
        console.log(accessToken)
        try {
            console.log("GETTING USER INFO")

            userInfo = await getUserInfo(accessToken)
        } catch(err){
            console.error("FAILED GETTING USER INFO", err)
            res({ ok: false, message: "error getting user identity" })
            return
        }
        // could check the db here in order to make sure the user hasn't done it twice
        // althought I'm not sure if its that important 
        try {
            console.log("GETTING SUBREDDITS")

            subreddits = await getSubreddits(accessToken)
        } catch(err){
            console.error("FAILED GETTING SUBREDDITS", err)
            res({ ok: false, message: "error getting subreddits" })
            return
        }


        USERNAME = userInfo.name
        console.log("ADDING TO FIRESTORE DB")
        // take the list of subreddits and add it to a database
        await firestore.collection("users").doc(USERNAME).set({
            timestamp: new Date().getTime(),
            userInfo: formatUserInfo(userInfo),
            subreddits: formatSubreddits(subreddits)
        })
        
        res({ ok: true, message: "success" })
    })
})



// exports.match = functions.pubsub