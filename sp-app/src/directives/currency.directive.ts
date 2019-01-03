import { Directive, HostListener, ElementRef, OnInit, AfterViewInit } from "@angular/core";
import { CustomCurrencyPipe } from "../helpers/currency-helper";

@Directive({ selector: "[currencyFormatter]" })
export class CurrencyFormatterDirective implements OnInit, AfterViewInit {

    private el: HTMLInputElement;

    constructor(
        public elementRef: ElementRef,
        private currencyPipe: CustomCurrencyPipe
    ) {
    }

    ngAfterViewInit() {
        this.el = this.elementRef.nativeElement.getElementsByTagName('input')[0];
        this.el.value = this.currencyPipe.transform(this.el.value);
    }

    ngOnInit() { 
    }

    @HostListener("ionFocus", ["$event.value"])
    onFocus(value) {
        this.el.value = this.currencyPipe.transform(value);
    }

    @HostListener("ionBlur", ["$event.value"])
    onBlur(value) {
        this.el.value = this.currencyPipe.transform(value);
    }

    @HostListener("keyup", ["$event.keyCode"])
    onKeyUp(key) {
        var value = this.el.value;
        if ((key >= 48 && key <= 57) || key == 8) {
            // 0-9 || delete
        } else {
            value = value.slice(0, -1);
        }
        this.el.value = this.currencyPipe.transform(value);
    }

}