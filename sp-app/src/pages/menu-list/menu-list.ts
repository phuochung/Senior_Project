import { UIHelper } from './../../helpers/ui-helper';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { AppUploadUrl, AppSetting } from '../../app/constants';
import { CurrencyHelper } from '../../helpers/currency-helper';
import { Criteria } from '../../models/criteria.model';
import { MenuCreatePage } from '../menu-create/menu-create';

@Component({
  selector: 'page-menu-list',
  templateUrl: 'menu-list.html'
})

export class MenuListPage implements OnInit {
  items = [];
  filteredItems = [];
  statusFilter = "food";
  isLoading = false;
  menuImgUrl = AppSetting.StaticRoot + AppUploadUrl.MenuUploadUrl;
  criteria: Criteria = new Criteria();
  currencyHelper = CurrencyHelper;

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private uiHelper: UIHelper,
    public platform: Platform,
    public navCtrl: NavController,
    public events: Events
  ) {
  }

  ngOnInit() {
    this.bindMenu();
  }

  bindMenu(tab?: string) {
    if (tab) {
      this.criteria = new Criteria();
      this.items = [];
    }

    this.isLoading = true;
    if (this.criteria.currentPage > this.criteria.totalPage) {
      this.isLoading = false;
      return;
    }

    this.criteria.currentPage++;
    this.criteria.searchText = this.statusFilter;
    this.menuService.getMenu(this.authService.getAccessToken(), this.criteria).then((result: any) => {
      if (result.success) {
        var data = result.data;
        this.criteria = data.criteria;
        this.items = this.items.concat(data.menu);
      }
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
      this.uiHelper.alert(error);
    });
  }

  loadMore() {
    this.bindMenu();
  }

  goToMenuCreatePage(itemId) {
    var isFood = this.statusFilter == 'food';
    this.navCtrl.push(MenuCreatePage, { isFood, itemId });
  }

  setDefaultPic(item) {
    item.thumbnail = "no-image.png";
  }
}
