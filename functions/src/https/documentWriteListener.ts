import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const database = admin.database();

export const documentWriteListener = functions.firestore.document('users/{documentUid}').onWrite((change, context) => {
    if (!change.before.exists) {
        console.log('INCREMENTING SIGNUP COUNTER');
        return database.ref('signup_count').transaction(function (current_value: any) {
            return (current_value || 0) + 1;
        });
    } else if (!change.after.exists) {
        console.log('DECREMENTING SIGNUP COUNTER');
        return database.ref('signup_count').transaction(function (current_value: any) {
            return (current_value || 0) - 1;
        });
    }
    return Promise.resolve();
});