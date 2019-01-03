import { AppSetting, SearchingStatus } from './../app/constants';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ReservationService{
    private updateReservationUrl = `${AppSetting.APIHost}/bot/book`;
    private getReservationsUrl = `${AppSetting.APIHost}/bot/book/get`;
    
    constructor(
        private http: Http
    ) {
    }

    getReservations(accessToken: string, currentPage: number) {
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

            this.http.post(this.getReservationsUrl, body, options)
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
    
    getAllReservations(accessToken: string, criteria: any) {
        return new Promise((resolve, reject) => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });
            
            this.http.post(this.getReservationsUrl, JSON.stringify(criteria), options)
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
    
    updateReservation(reservation, accessToken){
        return new Promise((resolve, reject) => {
            let body = reservation;
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': accessToken
            });
            let options = new RequestOptions({ headers: headers });

            this.http.post(this.updateReservationUrl, body, options)
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