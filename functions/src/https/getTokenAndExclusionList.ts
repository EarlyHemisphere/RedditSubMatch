import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { submitUserLogin_i } from '../../../shared/interfaces';
import { getAccessToken, getSubreddits, getUserInfo } from '../helpers';

const firestore = admin.firestore();

export const getTokenAndExclusionList = functions.https.onCall( async(data: submitUserLogin_i) => {
    return new Promise(async (res, rej) => {
        let accessToken: string;
        let userInfo: any;
        let subreddits: string[];

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
        let exclusionList: string[] = [];

        console.log('GETTING USER SUBREDDITS');
        try {
            subreddits = await getSubreddits(accessToken);
        } catch(err) {
            console.error('FAILED TO GET USER SUBREDDITS', err.response.data);
            res({ ok: false, message: 'Getting user subreddits failed. Error code: ' + err.response.status });
            return;
        }

        console.log('GETTING EXCLUSION LIST FROM FIRESTORE');
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
                res({ ok: true, accessToken, subreddits, exclusionList });
                return;
            }).catch(err => {
                console.error('Error getting user document', err);
                res({ ok: false, message: 'db read failure'});
                return;
            });
    });
});