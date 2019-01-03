import { AppSetting } from './../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalStorageHelper } from '../helpers/localstorage-helper';

@Injectable()
export class CustomerService {
    private getCustomerRequestingChatUrl = `${AppSetting.APIHost}/bot/customer-request-chat`;

    constructor(
        private http: Http
    ) { }

    getCustomersRequestingChat(accessToken: string) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });
            this.http.get(this.getCustomerRequestingChatUrl, options)
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