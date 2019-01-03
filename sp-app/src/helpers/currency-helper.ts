import { Injectable } from "@angular/core";
import { LocalStorageSetting } from './../app/constants';

@Injectable()
export class CurrencyHelper {

    public static convertMoneyToNumber(price): number {
        if (price && isNaN(price))
            return +price.replace(',', '');
        else if (!isNaN(price)) return price;

        return 0;
    }

    public static getPriceByCurrencyCode(price: any, code): number {
        if (!price) return 0;
        var item = price.find(x => x.currency && x.currency.code == code);
        if (item) return item.value;
        return 0;
    }

    public static getPriceByCurrencyId(price: any, currencyId): number {
        if (!price) return 0;
        var item = price.find(x => x.currency && (x.currency == currencyId || x.currency._id == currencyId));
        if (item) return item.value;
        return 0;
    }

    public static getPrice(price: any): number {
        if (price.length < 1) {
            return 0;
        }
        var currency = JSON.parse(localStorage.getItem(LocalStorageSetting.currencyKey));
        var currencyId = currency.id;
        if (!price || !currencyId) return 0;
        var item = price.find(x => x.currency && (x.currency == currencyId || x.currency._id == currencyId));
        if (item) return item.value;
        if (!price || !currencyId) return 0;
    }

    public static getFormattedPrice(price: any): string {
        var currency = JSON.parse(localStorage.getItem(LocalStorageSetting.currencyKey));
        if (!currency) return "0";
        var currencyId = currency.id;
        var currencyCode = currency.code;
        var result = 0;
        if (price) {
            if (Array.isArray(price)) {
                var item = price.find(x => x.currency && (x.currency == currencyId || x.currency._id == currencyId));
                if (item) result = item.value;
            } else if (!isNaN(price)) {
                result = price;
            }
        }

        switch (currencyCode) {
            case 'VND':
                return result.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
            case 'USD':
                return result.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            default:
                return result.toString();
        }
    }

    public static getFormattedTotalPriceArr(priceArr): string {
        var total = 0;
        if (Array.isArray(priceArr)) {
            for (var i = 0; i < priceArr.length; i++) {
                total += this.getPrice(priceArr[i]);
            }
        }
        return this.getFormattedPrice(total);
    }
}

import { Pipe, PipeTransform } from "@angular/core";

const PADDING = "000000";

@Pipe({ name: "cutomCurrencyPipe" })
export class CustomCurrencyPipe implements PipeTransform {

    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor() {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = ".";
        this.THOUSANDS_SEPARATOR = ",";
    }

    transform(value: number | string, fractionSize: number = 0): string {
        let [integer, fraction = ""] = (value || "").toString()
            .split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";
        integer = this.parse(integer, fractionSize);
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 0): string {
        let [integer, fraction = ""] = (value || "").split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");

        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";

        return integer + fraction;
    }

}