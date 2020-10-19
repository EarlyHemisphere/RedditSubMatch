import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getUserInfo } from '../helpers';

interface saveBlacklist_i {
    accessToken: string;
    blacklist: any;
}

const firestore = admin.firestore();

export const saveBlacklist = functions.https.onCall(async (data: saveBlacklist_i) => {
    return new Promise(async (res, rej) => {
        const accessToken = data.accessToken;
        const newBlacklist = data.blacklist[0];
        let userInfo;
        console.log(JSON.stringify(newBlacklist));

        if (!accessToken) {
            console.error('ACCESS TOKEN IS UNDEFINED');
            res({ ok: false, message: 'Problem with data' });
            return;
        }
        console.log(accessToken);

        console.log('GETTING USERNAME');
        try {
            userInfo = await getUserInfo(accessToken);
        } catch(err) {
            console.error('FAILED GETTING USER INFO', err.response.data);
            res({ ok: false, message: 'Authentication information sent was invalid. Has your session lasted longer than an hour? Error code: ' + err.response.status });
            return;
        }
        const USERNAME = userInfo.name;
        console.log(USERNAME);

        if (newBlacklist.length == 0 || newBlacklist.length == 1 && newBlacklist[0] == '') {
            console.log('REMOVING USER BLACKLIST');
            await firestore.collection('blacklists').doc(USERNAME).delete();
        } else {
            console.log('WRITING BLACKLIST TO DB');
            await firestore.collection('blacklists').doc(USERNAME).set({
                timestamp: new Date().getTime(),
                blacklist: newBlacklist,
            });
        }
        
        res({ ok: true, message: 'success' });
        return;
    });
});