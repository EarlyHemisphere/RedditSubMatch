import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getUserInfo } from '../helpers';

interface saveBlacklist_i {
    accessToken: string;
    blacklist: any;
}

const firestore = admin.firestore();

export const saveBlacklist = functions.https.onCall(async (data: saveBlacklist_i) => {
    const accessToken = data.accessToken;
    const newBlacklist = data.blacklist[0];
    console.log(JSON.stringify(newBlacklist));

    if (!accessToken) {
        console.error('ACCESS TOKEN IS UNDEFINED');
        return { ok: false, message: 'Problem with data' };
    }
    console.log(accessToken);

    console.log('GETTING USERNAME');
    return getUserInfo(accessToken).then(info => {
        const USERNAME = info.name;
        console.log(USERNAME);

        if (newBlacklist.length == 0 || newBlacklist.length == 1 && newBlacklist[0] == '') {
            console.log('REMOVING USER BLACKLIST');
            return firestore.collection('blacklists').doc(USERNAME).delete();
        } else {
            console.log('WRITING BLACKLIST TO DB');
            return firestore.collection('blacklists').doc(USERNAME).set({
                timestamp: new Date().getTime(),
                blacklist: newBlacklist,
            });
        }
    }).then(() => {
        return { ok: true };
    }).catch(e => {
        if (e && e.isAxiosError && e.response) {
            console.error('FAILED TO SAVE BLACKLIST', e.response.data);
            return { ok: false, message: 'Failed to save blacklist: ' + e.response.data };
        } else {
            console.error('FAILED TO SAVE BLACKLIST');
            console.error(e);
            return { ok: false, message: 'Failed to save blacklist' };
        }
    });
});