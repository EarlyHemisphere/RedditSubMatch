import * as functions from 'firebase-functions';
import { getAccessToken, getUserInfo, revokeRefreshToken, revokeTempAccessToken } from './helpers';
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
        console.log("GETTING TOKEN(S)")
        try {
            ({ refreshToken, accessToken } = await getAccessToken(data.code, functions.config().reddit.clientid, functions.config().reddit.secret))
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN", err)
            res({ ok: false, message: "Access token retrieval failed" })
            return
        }
        console.log(accessToken)
        console.log(refreshToken)

        console.log("GETTING USERNAME")
        try {
            userInfo = await getUserInfo(accessToken)
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err)
            res({ ok: false, message: "Retrieval of user identity info failed" })
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
        let accessToken: string
        let resp
        let userInfo
        let USERNAME: string

        console.log("DELETING USER INFO")
        console.log("GETTING ACCESS TOKEN")
        try {
            ({ accessToken } = await getAccessToken(data.code, functions.config().reddit.clientid, functions.config().reddit.secret))
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN", err)
            res({ ok: false, message: "Access token retrieval failed" })
            return
        }
        console.log(accessToken)

        console.log("GETTING USERNAME")
        try {
            userInfo = await getUserInfo(accessToken)
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err)
            res({ ok: false, message: "Retrieval of user identity info failed" })
            return
        }

        USERNAME = userInfo.name

        console.log("GETTING USER CURRENT REFRESH TOKEN")
        firestore.collection('users').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    let docData = doc.data()
                    let refreshToken
                    if (docData) {
                        refreshToken = docData['refreshToken']
                    } else {
                        console.log('Error getting document data; data empty')
                    }

                    console.log(refreshToken)
                    if (refreshToken) {
                        console.log("REVOKING PERMANENT REFRESH TOKEN")
                        try {
                            resp = await revokeRefreshToken(refreshToken, functions.config().reddit.clientid, functions.config().reddit.secret)
                        } catch(err) {
                            console.error("FAILED REVOKING REFRESH TOKEN", err)
                            res({ ok: false, message: "Revoking of refresh token failed" })
                            return
                        }
                        console.log(resp)
                    }
                }
                console.log("REVOKING TEMP ACCESS TOKEN")
                try {
                    resp = await revokeTempAccessToken(accessToken, functions.config().reddit.clientid, functions.config().reddit.secret)
                } catch(err) {
                    console.error("FAILED REVOKING ACCESS TOKEN", err)
                    res({ ok: false, message: "Revoking of access token failed" })
                    return
                }
                console.log(resp)

                console.log("DELETING USER FROM FIRESTORE DB")
                await firestore.collection("users").doc(USERNAME).delete()
                
                res({ ok: true, message: "success" })
            }).catch(err => {
              console.log('Error getting document', err)
              res({ ok: false, message: 'failure'})
              // TODO: remove line above and instead write to the firestore error collection
            });
    })
})