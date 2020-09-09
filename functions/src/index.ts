import * as functions from 'firebase-functions';
import { getAccessToken, getUserInfo, revokeRefreshToken, testRefreshToken } from './helpers';
import * as admin from 'firebase-admin';

admin.initializeApp();
const firestore = admin.firestore();
const database = admin.database();

interface submitUserLogin_i {
    code: string;
    testing: boolean;
}

interface saveBlacklist_i {
    accessToken: string;
    blacklist: any;
}

exports.submitUserLogin = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken;
        let refreshToken: string;
        let userInfo;
        let resp: any;

        const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
        const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

        console.log("ADDING USER TOKEN");
        console.log("GETTING TOKEN(S)");
        try {
            ({ refreshToken, accessToken } = await getAccessToken(data.code, clientid, secret, data.testing));
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN", err);
            res({ ok: false, message: "Access token retrieval failed. Error code: " + err.error.error });
            return;
        }
        console.log(accessToken);
        console.log(refreshToken);
        if (!accessToken && !refreshToken) {
            console.error("ACCESS TOKEN AND REFRESH TOKEN ARE UNDEFINED");
            res({ ok: false, message: "User token retrieval failed" });
            return;
        }

        console.log("GETTING USERNAME");
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error("[Submit] FAILED GETTING USER INFO", err);
            await firestore.collection("unnamed tokens").doc(new Date().getTime().toString()).set({
                    error: err['error']['error'],
                    refreshToken
                });
            res({ ok: true, message: "success" });
            return;
        }
        const USERNAME = userInfo.name;
        console.log(USERNAME);

        firestore.collection('users').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log('User has not yet signed up, will write to db');
                } else {
                    const docData = doc.data();
                    let currentRefreshToken;
                    if (docData) {
                        currentRefreshToken = docData['refreshToken'];
                        if (!currentRefreshToken) {
                            console.log('Cannot retrieve document refresh token; no refresh token');
                        } else {
                            console.log('Current refresh token: ' + currentRefreshToken);
                            console.log('CHECKING IF CURRENT REFRESH TOKEN IS VALID');
                            try {
                                resp = await testRefreshToken(currentRefreshToken, clientid, secret);
                            } catch (err) {
                                if (err.error.error != 400) {
                                    console.error('FAILED TO TEST CURRENT REFRESH TOKEN', err);
                                    res({ ok: false, message: "Failed to test current refresh token: Error code: " + err.error.error });
                                    return;
                                } else {
                                    console.log(err);
                                    console.log('Received bad request error when testing current refresh token');
                                    resp = { access_token: null };
                                }
                            }
                            console.log(JSON.stringify(resp));
                            if (!resp['access_token']) {
                                console.log('SAVED REFRESH TOKEN IS INVALID, REVOKING');
                                try {
                                    resp = await revokeRefreshToken(currentRefreshToken, clientid, secret);
                                } catch(err) {
                                    console.error("FAILED REVOKING SAVED REFRESH TOKEN", err);
                                    res({ ok: false, message: "Revoking of saved refresh token failed. Error code: " + err.error.error });
                                    return;
                                }
                                console.log(JSON.stringify(resp));
                            } else {
                                console.log('REVOKING CURRENT REFRESH TOKEN');
                                try {
                                    await revokeRefreshToken(refreshToken, clientid, secret);
                                } catch(err) {
                                    console.error("FAILED REVOKING CURRENT REFRESH TOKEN", err);
                                    res({ ok: false, message: "Revoking of current refresh token failed. Error code: " + err.error.error });
                                    return;
                                }
                                res({ ok: true, message: "success" });
                                return;
                            }
                        }
                    } else {
                        console.log('Cannot retrieve document data; data empty');
                    }
                }
                console.log("ADDING TO FIRESTORE DB");
                await firestore.collection("users").doc(USERNAME).set({
                    timestamp: new Date().getTime(),
                    refreshToken,
                });
                res({ ok: true, message: "success" });
                return;
            }).catch(err => {
              console.error('Submit: Error getting user document', err);
              res({ ok: false, message: 'db read failure'});
              return;
            });
    });
});

exports.deleteUserInfo = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken: string;
        let resp;
        let userInfo;

        const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
        const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

        console.log("DELETING USER INFO");
        console.log("GETTING ACCESS TOKEN");
        try {
            ({ accessToken } = await getAccessToken(data.code, clientid, secret, data.testing));
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN", err);
            res({ ok: false, message: "Access token retrieval failed. Error code: " + err.error.error });
            return;
        }
        console.log(accessToken);

        if (!accessToken) {
            console.error("ACCESS TOKEN IS UNDEFINED");
            res({ ok: false, message: "User token retrieval failed" });
            return;
        }
        console.log("GETTING USERNAME");
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error("[Delete] FAILED GETTING USER INFO", err);
            res({ ok: false, message: "Retrieval of user identity info failed. Error code: " + err.error.error });
            return;
        }

        const USERNAME = userInfo.name;
        console.log(USERNAME);

        console.log("GETTING USER CURRENT REFRESH TOKEN");
        firestore.collection('users').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log('Cannot retrieve document; no such document');
                    await firestore.collection("empty deletes").doc(USERNAME).set({
                        timestamp: new Date().getTime(),
                    });
                } else {
                    const docData = doc.data();
                    let refreshToken;
                    if (docData) {
                        refreshToken = docData['refreshToken'];
                        if (!refreshToken) {
                            console.log('Error getting document refresh token; no refresh token');
                        } else {
                            console.log(refreshToken);
                        }
                    } else {
                        console.log('Cannot retrieve document data; data empty');
                    }

                    if (refreshToken) {
                        console.log("REVOKING PERMANENT REFRESH TOKEN");
                        try {
                            resp = await revokeRefreshToken(refreshToken, clientid, secret);
                        } catch(err) {
                            console.error("FAILED REVOKING REFRESH TOKEN", err);
                            res({ ok: false, message: "Revoking of refresh token failed. Error code: " + err.error.error });
                            return;
                        }
                        console.log(JSON.stringify(resp));
                    }

                    console.log("DELETING USER FROM FIRESTORE DB");
                    await firestore.collection("users").doc(USERNAME).delete();
                }

                res({ ok: true, message: "success" });
            }).catch(err => {
              console.error('Delete: Error getting user document', err);
              res({ ok: false, message: 'db read failure'});
            });
    });
});

exports.documentWriteListener = functions.firestore.document('users/{documentUid}').onWrite((change, context) => {
    return new Promise(async (res, rej) => {
        if (!change.before.exists) {
            console.log("INCREMENTING SIGNUP COUNTER");
            database.ref("signup_count").transaction(function (current_value: any) {
                return (current_value || 0) + 1;
            });
        } else if (!change.after.exists) {
            console.log("DECREMENTING SIGNUP COUNTER");
            database.ref("signup_count").transaction(function (current_value: any) {
                return (current_value || 0) - 1;
            });
        }
        res({ ok: true });
    });
});

exports.getTokenAndBlacklist = functions.https.onCall(async (data) => {
    return new Promise(async (res, rej) => {
        let accessToken: string;
        let userInfo: any;

        const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
        const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

        try {
            ({ accessToken } = await getAccessToken(data['code'], clientid, secret, data.testing));
        } catch(err) {
            console.error("FAILED GETTING ACCESS TOKEN", err);
            res({ ok: false, message: "Access token retrieval failed. Error code: " + err.error.error });
            return;
        }

        if (!accessToken) {
            console.error("ACCESS TOKEN IS UNDEFINED");
            res({ ok: false, message: "User token retrieval failed" });
            return;
        }

        console.log("GETTING USERNAME");
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err);
            res({ ok: false, message: "Retrieval of user identity info failed. Error code: " + err.error.error });
            return;
        }
        const USERNAME = userInfo.name;
        console.log(USERNAME);
        let blacklist: string[] = [];

        console.log("GETTING BLACKLIST FROM FIRESTORE");
        firestore.collection('blacklists').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log("USER HAS NO BLACKLIST ENTRY. RETURNING EMPTY");
                } else {
                    const docData = doc.data();
                    if (docData) {
                        console.log("RETURNING EXISTING BLACKLIST");
                        blacklist = docData['blacklist'];
                        console.log(blacklist);
                    } else {
                        console.log("USER HAS EMPTY BLACKLIST. RETURNING EMPTY");
                    }
                }
                res({ ok: true, accessToken: accessToken, username: userInfo.name, blacklist: blacklist });
                return;
            }).catch(err => {
                console.error('Error getting user document', err);
                res({ ok: false, message: 'db read failure'});
                return;
            });
    });
});

exports.saveBlacklist = functions.https.onCall(async (data: saveBlacklist_i) => {
    return new Promise(async (res, rej) => {
        const accessToken = data.accessToken;
        const newBlacklist = data.blacklist[0];
        let userInfo;
        console.log(newBlacklist);

        if (!accessToken) {
            console.error("ACCESS TOKEN IS UNDEFINED");
            res({ ok: false, message: "Problem with sent data: accessToken" });
            return;
        }
        console.log(accessToken);

        console.log("GETTING USERNAME");
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error("FAILED GETTING USER INFO", err);
            res({ ok: false, message: "Access code sent was invalid. Has your session lasted longer than an hour? " + err.error.error });
            return;
        }
        const USERNAME = userInfo.name;
        console.log(USERNAME);

        console.log("WRITING BLACKLIST TO DB");
        await firestore.collection("blacklists").doc(USERNAME).set({
            timestamp: new Date().getTime(),
            blacklist: newBlacklist,
        });
        res({ ok: true, message: "success" });
        return;
    });
});
