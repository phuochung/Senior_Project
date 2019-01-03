import { LocalStorageHelper } from './../helpers/localstorage-helper';
import { AppSetting, LocalStorageSetting } from './../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalizationProvider } from '../providers/localization.provider';

@Injectable()
export class AuthService {
    private static loginUrl = `${AppSetting.APIHost}/auth/login-provider`;
    private static registerUrl = `${AppSetting.APIHost}/auth/register`;
    private static checkUsernameUrl = `${AppSetting.APIHost}/auth/checkUsername`;
    private static verifyUrl = `${AppSetting.APIHost}/auth/token/verify`;
    public static logoutUrl: string = `${AppSetting.APIHost}/provider/logout`;

    constructor(
        private http: Http,
        private localizationProvider: LocalizationProvider
    ) {
    }

    getAccessToken() {
        return LocalStorageHelper.getStoredValueByKey(LocalStorageSetting.accessTokenKey);
    }

    setAccessToken(data: any) {
        // add extra currencyId data
        if (data.currencyId && data.currency) {
            var currencyStr = JSON.stringify({ code: data.currency, id: data.currencyId });
            localStorage.setItem(LocalStorageSetting.currencyKey, currencyStr);
        }
        
        if (data.accessToken !== undefined) {
            LocalStorageHelper.storeValueByKey(LocalStorageSetting.accessTokenKey, data.accessToken);
            return true;
        }
        return false;
    }

    storeProvider(provider){
        LocalStorageHelper.storeValueByKey(LocalStorageSetting.providerKey, JSON.stringify(provider));
    }

    getProvider(){
        let jsonString = LocalStorageHelper.getStoredValueByKey(LocalStorageSetting.providerKey);
        return JSON.parse(jsonString);
    }

    verifyToken(token) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Authorization': token
            });
            let options = new RequestOptions({ headers: headers });

            this.http.get(AuthService.verifyUrl, options)
                .map(res =>
                    res.json()
                )
                .subscribe(data => {
                    if (data.success)
                    {
                        this.storeProvider(data);
                        resolve(true)
                    }
                    else
                        resolve(false);
                }, error => {
                    reject({ error: error });
                });
        });
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            let body = JSON.stringify({ username, password });
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({ headers: headers });

            this.http.post(AuthService.loginUrl, body, options)
                .map(res =>
                    res.json()
                )
                .subscribe(data => {
                    this.storeProvider(data);
                    resolve(this.setAccessToken(data));
                }, error => {
                    reject({ error: error });
                });

        })
    }

    logout() {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Authorization': this.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });

            this.http.get(AuthService.logoutUrl, options)
                .map(res =>
                    res.json()
                )
                .subscribe(data => {
                    if (data.success){
                        localStorage.removeItem(LocalStorageSetting.accessTokenKey);
                        localStorage.removeItem(LocalStorageSetting.currencyKey);
                        localStorage.removeItem(LocalStorageSetting.providerKey);
                        localStorage.removeItem(LocalStorageSetting.localizationKey);
                        this.localizationProvider.get()
                            .then(success => {
                                console.log(success)
                                resolve(true);
                            });
                    }
                    else
                        resolve(false);
                }, error => {
                    reject({ error: error });
                });
        });
    }

    register(provider: any){
        return new Promise((resolve, reject) => {
            let body = JSON.stringify(provider);
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({ headers: headers });

            this.http.post(AuthService.registerUrl, body, options)
                .map(res =>
                    res.json()
                )
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    reject({ error: error });
                });

        })
    }

    checkExistingUsername(username){
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({ headers: headers });
            let url = `${AuthService.checkUsernameUrl}?username=${username}`;
            this.http.get(url, options)
                .map(res =>
                    res.json()
                )
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    reject({ error: error });
                });

        })
    }
}