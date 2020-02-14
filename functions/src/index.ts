import * as functions from 'firebase-functions';
import { getAccessToken, getUserInfo, revokeRefreshToken, testRefreshToken } from './helpers';
import * as admin from 'firebase-admin';

admin.initializeApp()
const firestore = admin.firestore()

interface submitUserLogin_i {
    code: string
}

exports.submitUserLogin = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken
        let testAccessToken
        let refreshToken: string
        let userInfo
        let USERNAME: string
        let resp

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

        firestore.collection('users').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log('User has not yet signed up, will write to db')
                } else {
                    let docData = doc.data()
                    let currentRefreshToken
                    if (docData) {
                        currentRefreshToken = docData['refreshToken']
                        if (!currentRefreshToken) {
                            console.log('Error getting document refresh token; no refresh token')
                        } else {
                            console.log('Current refresh token: ' + currentRefreshToken)
                            testAccessToken = await testRefreshToken(currentRefreshToken, functions.config().reddit.clientid, functions.config().reddit.secret)
                            if (!testAccessToken) {
                                console.log('Current refresh token is invalid, will write to db')
                            } else {
                                console.log('Current refresh token is valid. Revoking new refresh token')
                                try {
                                    resp = await revokeRefreshToken(refreshToken, functions.config().reddit.clientid, functions.config().reddit.secret)
                                } catch(err) {
                                    console.error("FAILED REVOKING REFRESH TOKEN", err)
                                    res({ ok: false, message: "Revoking of refresh token failed" })
                                    return
                                }
                                console.log(resp)
                                res({ ok: true, message: 'success'})
                                return
                            }
                        }
                    } else {
                        console.log('Error getting document data; data empty')
                    }
                }
                console.log("ADDING TO FIRESTORE DB")
                await firestore.collection("users").doc(USERNAME).set({
                    timestamp: new Date().getTime(),
                    refreshToken,
                })
                res({ ok: true, message: "success" })
            }).catch(err => {
              console.log('Error getting user document', err)
              res({ ok: false, message: 'failure'})
              // TODO: remove line above and instead write to the firestore error collection
            });
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
            console.error("FAILED GETTING ACCESS TOKEN", err)
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
                    console.log('No such document!')
                } else {
                    let docData = doc.data()
                    let refreshToken
                    if (docData) {
                        refreshToken = docData['refreshToken']
                        if (!refreshToken) {
                            console.log('Error getting document refresh token; no refresh token')
                        } else {
                            console.log(refreshToken)
                        }
                    } else {
                        console.log('Error getting document data; data empty')
                        // possibly write to firestore error collection
                    }

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

                    console.log("DELETING USER FROM FIRESTORE DB")
                    await firestore.collection("users").doc(USERNAME).delete()
                
                    res({ ok: true, message: "success" })
                }
            }).catch(err => {
              console.log('Error getting document', err)
              res({ ok: false, message: 'failure'})
              // TODO: remove line above and instead write to the firestore error collection
            });
    })
})