// This scheme was built on the assumption that users log in EACH TIME manually, and that's patently untrue

import { take, call, put, cancelled, cancel, fork, apply } from 'redux-saga/effects';
import { Alert, Platform } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';

import {
    LOGIN_REQUEST,
    LOGOUT,
} from 'app/ActionTypes';

import API from 'app/services/API';
import * as AuthActionCreators from 'app/redux/shared_actions/AuthActionCreators';

const AuthSaga = function * AuthSaga() {
    while (true) {
        // login
        const task = yield fork(executeLogin);

        // logout
        yield take(LOGOUT);
        yield cancel(task);
        try {
            const user = yield apply(GoogleSignin, GoogleSignin.currentUserAsync);
            yield apply(GoogleSignin, GoogleSignin.signOut);
        } catch(error) {
            console.tron.log("LOGOUT SIGN OUT ERROR " + error);
        }
    }
};

function* executeLogin() {
    try {
        yield take(LOGIN_REQUEST);
        const user = yield apply(GoogleSignin, GoogleSignin.signIn);
        let json = yield call(API.login, user.idToken);
        yield put(AuthActionCreators.loginSucceeded(json.accessToken, json.refreshToken, user.email, new Date(), json.revision, json.sets));
    } catch(error) {
        console.tron.log("ERROR " + error);
        if (error.code !== -5) { // -5 is when the user cancels the sign in
            showGenericAlert();
        }
        yield put(AuthActionCreators.logout());
    } finally {
        if (yield cancelled()) {
            // TODO: Fix double logout on errors
            // Login Error causes a logout, which will cause a cancel of login, which then causes a second logout
            // not a big deal as it's an edge case, but would be nice to fix
            yield put(AuthActionCreators.logout());
        }
    }
}

const showGenericAlert = () => {
    alert("Oops!", "Something went wrong during the signin process, please try again.");
};

const alert = (title, message) => {
    if (Platform.OS === 'ios') {
        // timeout is required to get around the window switching that the google sign in does on iOS
        // without it, the alert will not show
        setTimeout(() => { 
            Alert.alert(
                title,
                message,
            );
        }, 500);
    } else {
        // execute immediately on android
        Alert.alert(
            title,
            message,
        );
    }
};

export default AuthSaga;
