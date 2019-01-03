import { PromotionHelper } from './../../helpers/promotion-helper';
import { UIHelper } from './../../helpers/ui-helper';
import { AuthService } from './../../services/auth.service';
import { Criteria } from './../../models/criteria.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { PromotionService } from '../../services/promotion.service';
import { AppSetting, AppUploadUrl } from '../../app/constants';
import { PromotionCreatePage } from '../promotion-create/promotion-create';
import { CurrencyHelper } from '../../helpers/currency-helper';

@Component({
  selector: 'page-promotion-list',
  templateUrl: 'promotion-list.html',
})
export class PromotionListPage {
  criteria: Criteria = new Criteria();
  promotions = [];
  isLoading = false;
  promotionImgUrl = AppSetting.StaticRoot + AppUploadUrl.PromotionUploadUrl;
  promotionHelper = PromotionHelper;
  currencyHelper = CurrencyHelper;
  navCtrl: NavController;

  constructor(
    public subNavCtrl: NavController,
    private authService: AuthService,
    private promotionService: PromotionService,
    private uiHelper: UIHelper,
    public events: Events
  ) {
    this.navCtrl = this.subNavCtrl;
  }

  ionViewDidLoad() {
    this.bindPromotions();
  }

  bindPromotions() {
    this.isLoading = true;
    if (this.criteria.currentPage > this.criteria.totalPage) {
      this.isLoading = false;
      return;
    }
    this.promotionService.getAllPromotions(this.authService.getAccessToken(), this.criteria).then((result: any) => {
      if (result.success) {
        var data = result.data;
        this.criteria = data.criteria;
        this.promotions = this.promotions.concat(data.promotions);
        this.criteria.currentPage++;
      }
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
      this.uiHelper.alert(error);
    });
  }

  loadMore() {
    this.bindPromotions();
  }

  goToPromotionCreatePage(itemId) {
    this.navCtrl.push(PromotionCreatePage, { itemId });
  }

}
