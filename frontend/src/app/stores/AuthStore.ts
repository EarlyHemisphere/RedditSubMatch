import { observable, action } from 'mobx';
import app from "app/firebase/base";
import firebase from '@firebase/app';

export class AuthStore {
    @observable public isLoggedIn: boolean;
    @observable public loading: boolean;
    @observable user: any;
    constructor() {
        this.loading = true;
        this.isLoggedIn = false;
        app.auth().onAuthStateChanged(user => {
            if (user) {
                this.isLoggedIn = true;
                this.user = user;
            } else {
                this.isLoggedIn = false;
            }
            this.loading = false;
        });
    }

    @action
    handleUserSignup(email: string, password: string) {
        return new Promise((res, rej) => {
            app.auth().createUserWithEmailAndPassword(email, password).then(() => {
                res();
            }).catch((error) => {
                rej(error);
            });
        })
    }

    @action
    handleUserSignIn(email: string, password: string) {
        return new Promise((res, rej) => {
            app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    app.auth().signInWithEmailAndPassword(email, password).then((event) => {
                        console.log(event);
                        this.user = event.user
                        this.isLoggedIn = true;
                        res()
                    }).catch((error) => {
                        console.error(error)
                        rej(error.message)
                    });
                }).catch((error) => {
                    console.log(error);
                    rej(error)
                })
        })
    }
}

export default AuthStore;
