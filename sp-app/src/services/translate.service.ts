import { Injectable } from "@angular/core";
import { Localization } from "../models/localization.model";
import { LocalStorageHelper } from "../helpers/localstorage-helper";
import { LocalStorageSetting, Language } from "../app/constants";

@Injectable()
export class TranslateService {
    private _currentLang: string = Language.VI;
    localizations: Localization[] = [];

    constructor() { 
        var lang = LocalStorageHelper.getStoredValueByKey(LocalStorageSetting.languageKey);
        if (lang) this._currentLang = lang;
    }

    public use(lang: string): void {
        this._currentLang = lang ? lang : this._currentLang;
    }


    public translate(field: string) {
        //tranlsation happens here
        if (!this.localizations || this.localizations.length == 0) {
            var str =  LocalStorageHelper.getStoredValueByKey(LocalStorageSetting.localizationKey);
            if (str != null && str != '') {
                this.localizations = JSON.parse(str);
            }
        }
        var lst = this.localizations.filter(item => item.field == field);
        if (lst.length > 0) {
            var obj = lst[0];
            var rs = obj.values.filter(i => i.language == this._currentLang)[0];
            if (rs != undefined)
                return rs.content;
        }

        return field;

    }

    public instant(key: string) {
        // call translation
        return this.translate(key); 
    }
}