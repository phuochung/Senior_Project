import { UIHelper } from './ui-helper';
import { AuthService } from './../services/auth.service';
import { MenuType } from './../app/constants';
import { MenuService } from './../services/menu.service';
import { Injectable } from "@angular/core";

@Injectable()
export class MenuHelper {

    constructor(
        private authService: AuthService,
        private menuService: MenuService,
        private uiHelper: UIHelper
    ) {

    }
    
    converFoodTypeEnumToString(statusEnum){
        switch(statusEnum){
            case MenuType.Food:
                return "food";
            case MenuType.Drink:
                return "drink";
            default:
                return "others";
        }
    }
}