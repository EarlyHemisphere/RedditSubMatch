import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getAccessToken, getUserInfo } from '../helpers';

const firestore = admin.firestore();

export const getTokenAndBlacklist = functions.https.onCall(async (data) => {
    return new Promise(async (res, rej) => {
        let accessToken: string;
        let userInfo: any;

        const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
        const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

        try {
            ({ accessToken } = await getAccessToken(data['code'], clientid, secret, data.testing));
        } catch(err) {
            console.error('FAILED GETTING ACCESS TOKEN', err.response.data);
            res({ ok: false, message: 'Access token retrieval failed. Error code: ' + err.response.status });
            return;
        }

        if (!accessToken) {
            console.error('ACCESS TOKEN IS UNDEFINED');
            res({ ok: false, message: 'User token retrieval failed' });
            return;
        }

        console.log('GETTING USERNAME');
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error('FAILED GETTING USER INFO', err.response.data);
            res({ ok: false, message: 'Retrieval of user identity info failed. Error code: ' + err.response.status });
            return;
        }
        const USERNAME = userInfo.name;
        console.log(USERNAME);
        let blacklist: string[] = [];

        console.log('GETTING BLACKLIST FROM FIRESTORE');
        firestore.collection('blacklists').doc(USERNAME).get()
            .then(async (doc) => {
                if (!doc.exists) {
                    console.log('USER HAS NO BLACKLIST ENTRY. RETURNING EMPTY');
                } else {
                    const docData = doc.data();
                    if (docData) {
                        console.log('RETURNING EXISTING BLACKLIST');
                        blacklist = docData['blacklist'];
                        console.log(blacklist);
                    } else {
                        console.log('USER HAS EMPTY BLACKLIST. RETURNING EMPTY');
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