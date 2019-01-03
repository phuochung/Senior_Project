import { Injectable } from "@angular/core";
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';
import { AuthService } from "../services/auth.service";
import { CurrencyHelper } from "./currency-helper";
import { MenuService } from "../services/menu.service";

@Injectable()
export class ValidatorHelper {
    public static hasValidPercent(control: FormControl): any {
        if (isNaN(control.value)) return { 'not_number': true };
        if (control.value < 0 || control.value > 100) return { 'between_0_100': true };
        return null;
    }

    public static hasValidDateFromBeforeDateTo(from: string, to: string) {
        return (group: FormGroup): { [key: string]: any } => {
            if (!group.controls[from].value || !group.controls[to].value) return { 'Empty': true };
            var dateFrom = new Date(group.controls[from].value);
            var dateTo = new Date(group.controls[to].value);

            if (dateFrom >= dateTo) return { 'DateFromAfterDateTo': true };
            return null;
        }
    }

    public static hasValidPrice(control: FormControl): any {
        var val = CurrencyHelper.convertMoneyToNumber(control.value);
        if (val < 1000) return { 'MinimumPrice': true };
        return null;
    }

    public static checkExistingMenuName(menuService: MenuService,menuId = null) {
        return (control: AbstractControl) => {
            return menuService.checkExistingMenuName(control.value, menuId).then(res => {
                return res['success'] ? null : { existingMenuName: true };
            });
        };
    }

    public static hasValidPromotionDateTo(control: FormControl): any {
        if (!control.value) return { 'empty': true };
        var dateTo = new Date(control.value);
        dateTo.setHours(23, 59, 59);
        var today = new Date();
        if (dateTo.getTime() < today.getTime()) return { 'less_than_today': true };
        return null;
    }

    public static hasValidEmailPattern(control: FormControl): any {
        if (control.value && !control.value.match('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$')) return { 'invalidEmail': true }
        return null;
    }

    public static hasValidPhoneNumberPattern(control: FormControl): any {
        if (control.value && !control.value.match('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')) return { 'invalidPhoneNumber': true }
        return null;
    }

    public static hasNoSpecialCharacters(control: FormControl): any {
        if (!control.value) return { 'empty': true };
        var res = control.value.match('[a-zA-Z0-9]*');
        if (res.length > 0) return { 'has_special_characters': true };
        return null;
    }

    public static checkExistingUsername(authService: AuthService) {
        return (control: AbstractControl) => {
            return authService.checkExistingUsername(control.value).then(res => {
                return res['success'] ? null : { existingUsername: true };
            });
        };
    }

    public static MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmPassword').setErrors({ matchPassword: true })
        } else {
            return null
        }
    }
}