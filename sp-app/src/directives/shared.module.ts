import { NgModule } from '@angular/core';

import { CurrencyFormatterDirective } from '../directives/currency.directive';
import { CustomCurrencyPipe } from '../helpers/currency-helper';

@NgModule({
    declarations: [
        CustomCurrencyPipe,
        CurrencyFormatterDirective
    ],
    providers: [
        CustomCurrencyPipe
    ],
    exports: [
        CurrencyFormatterDirective
    ]
})
export class SharedModule { }