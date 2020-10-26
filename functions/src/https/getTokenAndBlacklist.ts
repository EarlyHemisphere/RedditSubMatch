import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getAccessToken, getUserInfo } from '../helpers';

const firestore = admin.firestore();

export const getTokenAndBlacklist = functions.https.onCall(async (data) => {
    const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
    const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

    return getAccessToken(data['code'], clientid, secret, data.testing).then((response): any => {
        const accessToken = response.accessToken;

        if (!accessToken) {
            console.error('ACCESS TOKEN IS UNDEFINED');
            return { ok: false, message: 'User token retrieval failed' };
        }

        console.log('GETTING USERNAME');
        return getUserInfo(accessToken).then(info => {
            const username = info.name;
            console.log(username);
            
            console.log('GETTING BLACKLIST FROM FIRESTORE');
            return firestore.collection('blacklists').doc(username).get().then(doc => {
                let blacklist: string[] = [];

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
        
                return { ok: true, accessToken, username, blacklist };
            });
        });
    }).catch(e => {
        if (e && e.isAxiosError && e.response) {
            console.error('FAILED TO RETRIEVE BLACKLIST', e.response.data);
            return { ok: false, message: 'Failed to retrieve blacklist: ' + e.response.data };
        } else {
            console.error('FAILED TO RETRIEVE BLACKLIST');
            console.error(e);
            return { ok: false, message: 'Failed to retrieve blacklist' };
        }
    });
});