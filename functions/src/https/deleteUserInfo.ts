import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { submitUserLogin_i } from '../../../shared/interfaces';
import { getAccessToken, getUserInfo, revokeRefreshToken } from '../helpers';

const firestore = admin.firestore();

export const deleteUserInfo = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken: string;
        let resp: any;
        let userInfo;
        
        const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
        const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];
        
        console.log('DELETING USER INFO');
        console.log('GETTING ACCESS TOKEN');
        try {
            ({ accessToken } = await getAccessToken(data.code, clientid, secret, data.testing));
        } catch(err) {
            console.error('FAILED GETTING ACCESS TOKEN', err.response.data);
            res({ ok: false, message: 'Access token retrieval failed. Error code: ' + err.response.status });
            return;
        }
        console.log(accessToken);

        if (!accessToken) {
            console.error('ACCESS TOKEN IS UNDEFINED');
            res({ ok: false, message: 'User token retrieval failed' });
            return;
        }
        console.log('GETTING USERNAME');
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error('[Delete] FAILED GETTING USER INFO', err.response.data);
            res({ ok: false, message: 'Retrieval of user identity info failed. Error code: ' + err.response.status });
            return;
        }

        const USERNAME = userInfo.name;
        console.log(USERNAME);

        console.log('GETTING USER CURRENT REFRESH TOKEN');
        firestore.collection('users').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log('Cannot retrieve document; no such document');
                    await firestore.collection('empty deletes').doc(USERNAME).set({
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
                        console.log('REVOKING PERMANENT REFRESH TOKEN');
                        try {
                            resp = await revokeRefreshToken(refreshToken, clientid, secret);
                        } catch(err) {
                            if (err.response.status != 400) {
                                console.error('FAILED REVOKING REFRESH TOKEN', err.response.data);
                                res({ ok: false, message: 'Revoking of refresh token failed. Error code: ' + err.response.status });
                                return;
                            }
                        }
                        console.log(JSON.stringify(resp));
                    }

                    console.log('DELETING USER FROM FIRESTORE DB');
                    await firestore.collection('users').doc(USERNAME).delete();
                    console.log('DELETING USER BLACKLIST');
                    await firestore.collection('blacklists').doc(USERNAME).delete();
                    console.log('DELETING USER EXCLUSION LIST');
                    await firestore.collection('exclusion lists').doc(USERNAME).delete();
                }

                res({ ok: true, message: 'success' });
            }).catch(err => {
              console.error('Delete: Error getting user document', JSON.stringify(err));
              res({ ok: false, message: 'db read failure'});
            });
    });
});