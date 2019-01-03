import { AppSetting, SearchingStatus } from './../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DeliveryService{
    private updateDeliveryUrl = `${AppSetting.APIHost}/bot/ship`;
    private getDeliveriesUrl = `${AppSetting.APIHost}/bot/ship/get`;
    
    constructor(
        private http: Http
    ) {
    }

    getDeliveries(accessToken: string, currentPage: number) {
        return new Promise((resolve, reject) => {
            let body = 
            {
                "currentPage": currentPage,
                "itemPerPage": AppSetting.MaxItemPerPage,
                "searchText": SearchingStatus.Active
            }
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });    

            this.http.post(this.getDeliveriesUrl, body, options)
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
    
    getAllDeliveries(accessToken: string, criteria: any) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });
            
            this.http.post(this.getDeliveriesUrl, JSON.stringify(criteria), options)
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
    
    updateDelivery(delivery, accessToken){
        return new Promise((resolve, reject) => {
            let body = delivery;
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });

            this.http.post(this.updateDeliveryUrl, body, options)
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