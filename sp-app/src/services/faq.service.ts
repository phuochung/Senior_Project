import { LocalStorageHelper } from '../helpers/localstorage-helper';
import { AppSetting } from '../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FaqService {
    private getAllAnswerFaqsUrl = `${AppSetting.APIHost}/bot/answerFaq/getAll`;
    private updateAnswerFaqUrl = `${AppSetting.APIHost}/bot/answerFaq`;
    constructor(
        private http: Http
    ) { }

    getAllAnsweFaq() {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });

            this.http.get(this.getAllAnswerFaqsUrl, options)
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

    update(body) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });
            this.http.put(this.updateAnswerFaqUrl, body, options)
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