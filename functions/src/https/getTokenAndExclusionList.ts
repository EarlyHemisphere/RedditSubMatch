import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { submitUserLogin_i } from '../../../shared/interfaces';
import { getAccessToken, getSubreddits, getUserInfo } from '../helpers';

const firestore = admin.firestore();

export const getTokenAndExclusionList = functions.https.onCall( async(data: submitUserLogin_i) => {
    const clientid = functions.config().reddit[data.testing ? 'test_clientid' : 'clientid'];
    const secret = functions.config().reddit[data.testing ? 'test_secret' : 'secret'];

    return getAccessToken(data.code, clientid, secret, data.testing).then((response): any => {
        const accessToken = response.accessToken;
        let exclusionList: string[] = [];

        if (!accessToken) {
            console.error('ACCESS TOKEN IS UNDEFINED');
            return { ok: false, message: 'User token retrieval failed' };
        }

        console.log('GETTING USERNAME');
        return getUserInfo(accessToken).then(info => {
            const USERNAME = info.name;
            console.log(USERNAME);

            console.log('GETTING USER SUBREDDITS');
            return getSubreddits(accessToken).then(subreddits => {
                return firestore.collection('exclusion lists').doc(USERNAME).get().then(doc => {
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

                    return { ok: true, accessToken, subreddits, exclusionList }
                })
            })
        });
    }).catch(e => {
        if (e && e.isAxiosError && e.response) {
            console.error('FAILED TO RETRIEVE EXCLUSION LIST', e.response.data);
            return { ok: false, message: 'Failed to retrieve blacklist: ' + e.response.data };
        } else {
            console.error('FAILED TO RETRIEVE EXCLUSION LIST');
            console.error(e);
            return { ok: false, message: 'Failed to retrieve blacklist' };
        }
    });
});