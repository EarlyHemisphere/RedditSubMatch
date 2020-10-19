import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getUserInfo } from '../helpers';

interface saveExclusionList_i {
    accessToken: string;
    exclusionList: string[];
}

const firestore = admin.firestore();

export const saveExclusionList = functions.https.onCall( async (data: saveExclusionList_i) => {
    return new Promise(async (res, rej) => {
        const accessToken = data.accessToken;
        const exclusionList = data.exclusionList;
        let userInfo: any;

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

        if (exclusionList.length == 0 || exclusionList.length == 1 && exclusionList[0] == '') {
            console.log('REMOVING USER EXCLUSION LIST');
            await firestore.collection('exclusion lists').doc(USERNAME).delete();
        } else {
            console.log('WRITING EXCLUSION LIST TO DB');
            await firestore.collection('exclusion lists').doc(USERNAME).set({
                timestamp: new Date().getTime(),
                subreddits: exclusionList,
            });
        }

        res({ ok: true, message: 'success' });
    });
});