import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getUserInfo } from '../helpers';

interface saveExclusionList_i {
    accessToken: string;
    exclusionList: string[];
}

const firestore = admin.firestore();

export const saveExclusionList = functions.https.onCall(async(data: saveExclusionList_i) => {
    const accessToken = data.accessToken;
    const exclusionList = data.exclusionList;

    if (!accessToken) {
        console.error('ACCESS TOKEN IS UNDEFINED');
        return { ok: false, message: 'Problem with data' };
    }
    console.log(accessToken);

    console.log('GETTING USERNAME');
    return getUserInfo(accessToken).then(info => {
        const USERNAME = info.name;
        console.log(USERNAME);

        if (exclusionList.length == 0 || exclusionList.length == 1 && exclusionList[0] == '') {
            console.log('REMOVING USER EXCLUSION LIST');
            return firestore.collection('exclusion lists').doc(USERNAME).delete();
        } else {
            console.log('WRITING EXCLUSION LIST TO DB');
            return firestore.collection('exclusion lists').doc(USERNAME).set({
                timestamp: new Date().getTime(),
                subreddits: exclusionList,
            });
        }
    }).then(() => {
        return { ok: true };
    }).catch(e => {
        if (e && e.isAxiosError && e.response) {
            console.error('FAILED TO SAVE EXCLUSION LIST', e.response.data);
            return { ok: false, message: 'Failed to save exclusion list: ' + e.response.data };
        } else {
            console.error('FAILED TO SAVE EXCLUSION LIST');
            console.error(e);
            return { ok: false, message: 'Failed to save exclusion list' }
        }
    })
});