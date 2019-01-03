import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { AppSetting, LocalStorageSetting } from "../app/constants";
import { LocalStorageHelper } from "../helpers/localstorage-helper";

@Injectable()
export class LocalizationProvider {
    private getLocalizationUrl = `${AppSetting.APIHost}/provider/localization`;
    private locals = null;

    constructor(private http: Http) {

    }

    public getLocalizations(): any {
        return this.locals;
    }

    get() {
        return new Promise((resolve, reject) => {
            let options = new RequestOptions({
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

            this.http
                .get(this.getLocalizationUrl, options)
                .map(res => res.json())
                .subscribe(response => {
                    LocalStorageHelper.storeValueByKey(LocalStorageSetting.localizationKey, JSON.stringify(response));
                    this.locals = response;
                    resolve(true);
                })
        })
    }
}