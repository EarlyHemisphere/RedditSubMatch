import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { submitUserLogin_i } from '../../../shared/interfaces';
import { getAccessToken, getUserInfo, revokeRefreshToken } from '../helpers';

const firestore = admin.firestore();

export const deleteUserInfo = functions.https.onCall(async (data: submitUserLogin_i) => {
    const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
    const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];
    
    console.log('GETTING ACCESS TOKEN');
    return getAccessToken(data.code, clientid, secret, data.testing).then(response => {
        if (!response.accessToken) {
            console.error('ACCESS TOKEN IS UNDEFINED');
            return { ok: false, message: 'User token retrieval failed' };
        }

        return getUserInfo(response.accessToken);
    }).then(info => {
        const USERNAME = info.name;
        console.log(USERNAME);

        console.log('GETTING USER CURRENT REFRESH TOKEN');
        return firestore.collection('users').doc(USERNAME).get().then(doc => {
            if (!doc.exists) {
                console.log('Cannot retrieve document; no such document');
                return firestore.collection('empty deletes').doc(USERNAME).set({
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
                    const resp = revokeRefreshToken(refreshToken, clientid, secret).catch(e => {
                        if (e.response.status != 400) {
                            console.error('FAILED REVOKING REFRESH TOKEN', e.response.data);
                            return { ok: false, message: 'Revoking of refresh token failed. Error code: ' + e.response.status };
                        }
                    });
                    console.log(JSON.stringify(resp));
                }
            }
        }).then(() => {
            console.log('DELETING ALL USER INFO');
            return Promise.all([
                firestore.collection('users').doc(USERNAME).delete(),
                firestore.collection('blacklists').doc(USERNAME).delete(),
                firestore.collection('exclusion lists').doc(USERNAME).delete()
            ]);
        }).catch(e => {
            if (e && e.isAxiosError && e.response) {
                console.error('FAILED TO DELETE USER', e.response.data);
                return { ok: false, message: 'Failed to delete user: ' + e.response.data };
            } else {
                console.error('FAILED TO DELETE USER');
                console.error(e);
                return { ok: false, message: 'Failed to delete user' };
            }
        });
    });
});