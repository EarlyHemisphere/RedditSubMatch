import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { submitUserLogin_i } from '../../../shared/interfaces';
import { getAccessToken, getSubreddits, getUserInfo, revokeRefreshToken, testRefreshToken } from '../helpers';

const firestore = admin.firestore();

export const submitUserLogin = functions.https.onCall(async (data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken: string;
        let refreshToken: string;
        let userInfo: any;
        let resp: any;
        let subreddits: string[] = [];
        let exclusionList: string[] = [];
        let writeToDb = true;

        const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
        const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

        console.log('GETTING TOKEN(S)');
        try {
            ({ refreshToken, accessToken } = await getAccessToken(data.code, clientid, secret, data.testing));
        } catch(err) {
            console.error('FAILED GETTING ACCESS TOKEN AND REFRESH TOKEN', err.response.data);
            res({ ok: false, message: 'Access token retrieval failed. Error code: ' + err.response.status });
            return;
        }
        console.log(accessToken);
        console.log(refreshToken);
        if (!accessToken && !refreshToken) {
            console.error('ACCESS TOKEN AND REFRESH TOKEN ARE UNDEFINED');
            res({ ok: false, message: 'User token retrieval failed' });
            return;
        }

        console.log('GETTING USERNAME');
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error('[Submit] FAILED GETTING USER INFO', err.response.data);
            await firestore.collection('unnamed tokens').doc(new Date().getTime().toString()).set({
                    error: err.response.data,
                    refreshToken
                });
            res({ ok: true, message: 'success' });
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
                    let savedRefreshToken;
                    if (docData) {
                        savedRefreshToken = docData['refreshToken'];
                        if (!savedRefreshToken) {
                            console.log('Cannot retrieve document refresh token; no refresh token');
                        } else {
                            console.log('Current refresh token: ' + savedRefreshToken);
                            console.log('CHECKING IF CURRENT REFRESH TOKEN IS VALID');
                            try {
                                resp = await testRefreshToken(savedRefreshToken, clientid, secret);
                            } catch (err) {
                                if (err.response.status != 400) {
                                    console.error('FAILED TO TEST CURRENT REFRESH TOKEN', err.response.data);
                                    res({ ok: false, message: 'Failed to test current refresh token: Error code: ' + err.response.status });
                                    return;
                                } else {
                                    console.log(JSON.stringify(err));
                                    console.log('Received bad request error when testing current refresh token');
                                    resp = { access_token: null };
                                }
                            }
                            console.log(JSON.stringify(resp));
                            if (!resp['access_token']) {
                                console.log('SAVED REFRESH TOKEN IS INVALID, REVOKING');
                                try {
                                    resp = await revokeRefreshToken(savedRefreshToken, clientid, secret);
                                } catch(err) {
                                    if (err.response.status != 400) {
                                        console.error('FAILED REVOKING SAVED REFRESH TOKEN', err.response.data);
                                        res({ ok: false, message: 'Revoking of saved refresh token failed. Error code: ' + err.response.status });
                                        return;
                                    } else {
                                        console.log(JSON.stringify(err));
                                        console.log('Received bad request error when revoking current refresh token');
                                    }
                                }
                                console.log(JSON.stringify(resp));
                            } else {
                                console.log('SAVED REFRESH TOKEN IS VALID');
                                console.log('REVOKING CURRENT REFRESH TOKEN');
                                try {
                                    await revokeRefreshToken(refreshToken, clientid, secret);
                                } catch(err) {
                                    console.error('FAILED REVOKING CURRENT REFRESH TOKEN', err.response.data);
                                    res({ ok: false, message: 'Revoking of current refresh token failed. Error code: ' + err.response.status });
                                    return;
                                }
                                
                                accessToken = (await testRefreshToken(savedRefreshToken, clientid, secret))['access_token'];
                                writeToDb = false;
                            }
                        }
                    } else {
                        console.log('Cannot retrieve document data; data empty');
                    }
                }

                console.log('GETTING USER SUBREDDITS');
                    try {
                        subreddits = await getSubreddits(accessToken);
                    } catch(err) {
                        console.error(err);
                        console.error('FAILED TO GET USER SUBREDDITS', err.response.data);
                        res({ ok: false, message: 'Getting user subreddits failed. Error code: ' + err.response.status });
                        return;
                    }

                console.log('GETTING USER EXCLUSION LIST');
                firestore.collection('exclusion lists').doc(USERNAME).get()
                    .then(async (doc) => {
                        if (!doc.exists) {
                            console.log('USER HAS NO EXCLUSION LIST. RETURNING EMPTY');
                        } else {
                            const docData = doc.data();

                            if (docData) {
                                console.log('RETURNING EXISTING EXCLUSION LIST');
                                exclusionList = docData['subreddits'];
                                console.log(JSON.stringify(exclusionList));
                            } else {
                                console.log('USER HAS EMPTY EXCLUSION LIST. RETURNING EMPTY');
                            }
                        }

                        if (writeToDb) {
                            console.log('ADDING TO FIRESTORE DB');
                            await firestore.collection('users').doc(USERNAME).set({
                                timestamp: new Date().getTime(),
                                refreshToken,
                            });
                        }

                        res({ ok: true, message: 'success', accessToken, subreddits, exclusionList });
                        return;
                    }).catch(err => {
                        console.error('Error getting user document', err);
                        res({ ok: false, message: 'db read failure'});
                        return;
                    });
            }).catch(err => {
                console.error(err)
                console.error('Submit: Error getting user document', JSON.stringify(err));
                res({ ok: false, message: 'db read failure' });
                return;
            });
    });
});