import { LocalStorageHelper } from './../helpers/localstorage-helper';
import { AppSetting } from './../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PromotionService {
    private getAllPromotionsUrl = `${AppSetting.APIHost}/bot/promotion/get`;
    private getPromotionByIdUrl = `${AppSetting.APIHost}/bot/promotion/getById`;
    private uploadPromotionThumbnailUrl = `${AppSetting.APIHost}/bot/image/upload?type=promotion`;
    private savePromotionUrl = `${AppSetting.APIHost}/bot/promotion/save`;
    private deletePromotionUrl = `${AppSetting.APIHost}/bot/promotion/delete`;

    constructor(
        private http: Http
    ) {
    }

    getAllPromotions(accessToken: string, criteria: any) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });

            this.http.post(this.getAllPromotionsUrl, JSON.stringify(criteria), options)
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

    getPromotionById(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });
            let url = `${this.getPromotionByIdUrl}?id=${id}`;
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

    savePromotion(item: any, formData?: FormData): Promise<boolean> {
        let newImage: string;
        let headers = new Headers({
            'Authorization': LocalStorageHelper.getAccessToken()
        });
        let options = new RequestOptions({ headers: headers });
        if (formData != null) {
            return this.http.post(this.uploadPromotionThumbnailUrl, formData, options)
                .toPromise()
                .then(res => {
                    var rs = res.json();
                    newImage = rs['data'];
                }
                    , err => {
                        console.log(err);
                    })
                .then(() => {
                    item.oldImageName = item.imageName;
                    item.imageName = newImage;
                    return this.savePromotion(item);
                });
        } else {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            return this.http.post(this.savePromotionUrl, JSON.stringify(item), { headers: headers })
                .toPromise()
                .then(res => {
                    return res.json();
                });
        }
    }

    delete(id): Promise <any>{
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': LocalStorageHelper.getAccessToken()
            });
            let options = new RequestOptions({ headers: headers });
            let url = `${this.deletePromotionUrl}?id=${id}`
            this.http.delete(url, options)
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