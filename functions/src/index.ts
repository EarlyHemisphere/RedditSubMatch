import * as admin from 'firebase-admin';

admin.initializeApp();

import { submitUserLogin } from './https/submitUserLogin';
import { deleteUserInfo } from './https/deleteUserInfo';
import { documentWriteListener } from './https/documentWriteListener';
import { getTokenAndBlacklist } from './https/getTokenAndBlacklist';
import { saveBlacklist } from './https/saveBlacklist';
import { getTokenAndExclusionList } from './https/getTokenAndExclusionList';
import { saveExclusionList } from './https/saveExclusionList';

exports.submitUserLogin = submitUserLogin;
exports.deleteUserInfo = deleteUserInfo;
exports.documentWriteListener = documentWriteListener;
exports.getTokenAndBlacklist = getTokenAndBlacklist;
exports.saveBlacklist = saveBlacklist;
exports.getTokenAndExclusionList = getTokenAndExclusionList;
exports.saveExclusionList = saveExclusionList;