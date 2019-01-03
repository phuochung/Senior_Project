import { Pipe, PipeTransform } from '@angular/core';
import { Localization } from '../models/localization.model';
import { Language, LocalStorageSetting } from '../app/constants';
import { LocalStorageHelper } from './localstorage-helper';
import { TranslateService } from '../services/translate.service';

@Pipe({
    name: 'translate',
    pure: false
})

export class TranslatePipe implements PipeTransform {

    constructor(
        private translateService: TranslateService
    ) { 
       
    }

    transform(value: string, args: any[]): any {
        if (!value) return;
        return this.translateService.instant(value);
    }
}