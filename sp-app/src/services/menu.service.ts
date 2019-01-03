import { AppSetting, SearchingStatus } from './../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalStorageHelper } from '../helpers/localstorage-helper';

@Injectable()
export class MenuService {
    private getMenuUrl = `${AppSetting.APIHost}/bot/menu/get`;
    private getMenuByIdUrl = `${AppSetting.APIHost}/bot/menu/getById`;
    private deleteMenuByIdUrl = `${AppSetting.APIHost}/bot/menu/deleteById`;
    private addMenuUrl = `${AppSetting.APIHost}/bot/menu/save`;
    private uploadMenuThumbnailUrl = `${AppSetting.APIHost}/bot/image/upload?type=menu`;
    private checkExistingMenuNameUrl = `${AppSetting.APIHost}/bot/menu/checkMenuName`;

    constructor(
        private http: Http
    ) {
    }

    getMenu(accessToken: string, criteria: any) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });
            this.http.post(this.getMenuUrl, JSON.stringify(criteria), options)
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

    addItemToMenu(item: any, ids, act: String, body?): Promise<boolean> {
        let newImage: string;
        let headers = new Headers({
            // 'Content-Type': 'application/json',
            'Authorization': LocalStorageHelper.getAccessToken()
        });
        let options = new RequestOptions({ headers: headers });
        if (body != null) {
            return this.http.post(this.uploadMenuThumbnailUrl, body, options)
                .toPromise()
                .then(res => {
                    var rs = res.json();
                    newImage = rs['data'];
                }
                    , err => {
                        console.log(err);
                    })
                .then(() => {
                    item.oldThumbnail = item.thumbnail ? item.thumbnail : '';
                    item.thumbnail = newImage;
                    return this.addItemToMenu(item, ids, act);
                });
        } else {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            var data = { item, ids };
            let url = `${this.addMenuUrl}?act=${act}`;
            return this.http.post(url, JSON.stringify(data), { headers: headers })
                .toPromise()
                .then(res => {
                    return res.json();
                });
        }
    }

    getMenuById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });
            let url = `${this.getMenuByIdUrl}?id=${id}`;
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

    deleteMenuById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });
            let url = `${this.deleteMenuByIdUrl}?id=${id}`;
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

    checkExistingMenuName(name, menuId) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let data = {
                name: name,
                menuId: menuId
            }
            let url = `${this.checkExistingMenuNameUrl}?name=${name}`;
            this.http.post(url, JSON.stringify(data), { headers: headers })
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