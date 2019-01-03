import { LocalStorageSetting } from './../app/constants';
import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageHelper {
    public static getStoredValueByKey(storedKey) {
        return localStorage.getItem(storedKey);
    }

    public static storeValueByKey(key, value) {        
        localStorage.setItem(key, value);
    }

    public static getAccessToken(){
        return this.getStoredValueByKey(LocalStorageSetting.accessTokenKey);
    }
}