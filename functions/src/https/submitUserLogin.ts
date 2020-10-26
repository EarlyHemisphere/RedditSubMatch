import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { submitUserLogin_i } from '../../../shared/interfaces';
import { getAccessToken, getSubreddits, getUserInfo, revokeRefreshToken, testRefreshToken } from '../helpers';

const firestore = admin.firestore();

export const submitUserLogin = functions.https.onCall(async(data: submitUserLogin_i) => {
    let accessToken = '';
    let refreshToken = '';
    let USERNAME = '';
    let writeToDb = true;

    const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
    const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

    console.log('GETTING TOKEN(S)');
    return getAccessToken(data.code, clientid, secret, data.testing).then(tokens => {
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
        
        console.log(accessToken);
        console.log(refreshToken);
        if (!accessToken && !refreshToken) {
            console.error('ACCESS TOKEN AND REFRESH TOKEN ARE UNDEFINED');
            return { ok: false, message: 'User token retrieval failed' };
        }
        
        console.log('GETTING USERNAME');
        return getUserInfo(accessToken);
    }).then(info => {
        USERNAME = info.name;
        console.log(USERNAME);

        return firestore.collection('users').doc(USERNAME).get()
    }).then(doc => {
        if (!doc.exists) {
            console.log('User has not yet signed up, will write to db');
        } else {
            const docData = doc.data();
            let savedRefreshToken: string;
            if (docData) {
                savedRefreshToken = docData['refreshToken'];
                if (!savedRefreshToken) {
                    console.log('Cannot retrieve document refresh token; no refresh token');
                } else {
                    console.log('Saved refresh token: ' + savedRefreshToken);
                    return testRefreshToken(savedRefreshToken, clientid, secret).then(response => {
                        return response;
                    }).catch(e => {
                        if (e.response && e.response.status && e.response.status == 400) {
                            console.log(JSON.stringify(e));
                            console.log('Received bad request error when testing saved refresh token');
                            return { access_token: null };
                        } else {
                            throw e;
                        }
                    }).then(response => {
                        console.log(JSON.stringify(response));

                        if (!response['access_token']) {
                            console.log('SAVED REFRESH TOKEN IS INVALID, REVOKING');
                            return revokeRefreshToken(savedRefreshToken, clientid, secret);
                        } else {
                            console.log('SAVED REFRESH TOKEN IS VALID');
                            console.log('REVOKING CURRENT REFRESH TOKEN');

                            return revokeRefreshToken(refreshToken, clientid, secret).then(() => {
                                return testRefreshToken(savedRefreshToken, clientid, secret).then(response => {
                                    accessToken = response['access_token'];
                                    writeToDb = false;
                                });
                            })
                        }
                    }).catch(e => {
                        if (e.response && e.response.status && e.response.status == 400) {
                            console.log(JSON.stringify(e));
                            console.log('Received bad request error when attempting api call');
                        } else {
                            throw e;
                        }
                    });
                }
            } else {
                console.log('Cannot retrieve document data; data empty');
            }
        }
    }).then(() => {
        console.log('GETTING USER SUBREDDITS');
        return getSubreddits(accessToken).then(subreddits => {
            console.log('GETTING USER EXCLUSION LIST');
            return firestore.collection('exclusion lists').doc(USERNAME).get().then(doc => {
                if (!doc.exists) {
                    console.log('USER HAS NO EXCLUSION LIST. RETURNING EMPTY');
                } else {
                    const docData = doc.data();

                    if (docData) {
                        console.log('RETURNING EXISTING EXCLUSION LIST');
                        console.log(JSON.stringify(docData['subreddits']));
                        return docData['subreddits'];
                    } else {
                        console.log('USER HAS EMPTY EXCLUSION LIST. RETURNING EMPTY');
                    }
                }
                return [];
            }).then((exclusionList: string[]): any => {
                if (writeToDb) {
                    console.log('ADDING TO FIRESTORE DB');
                    return firestore.collection('users').doc(USERNAME).set({
                        timestamp: new Date().getTime(),
                        refreshToken,
                    }).then(() => {
                        return exclusionList;
                    });
                }
                
                return exclusionList;
            }).then(exclusionList => {
                return { ok: true, message: 'success', accessToken, subreddits, exclusionList }
            });
        });
    }).catch(e => {
        console.error('Problem with user signup');
        console.error(JSON.stringify(e));
        return { ok: false, message: 'Error processing user signup' }
    });
});