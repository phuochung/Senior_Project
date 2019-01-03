import { UIHelper } from './../../helpers/ui-helper';;
import { Component, OnInit, ElementRef } from '@angular/core';
import { NavController, Platform, Events, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { AppUploadUrl, AppSetting, PromotionStatus } from '../../app/constants';
import { CurrencyHelper } from '../../helpers/currency-helper';
import { DomSanitizer } from '@angular/platform-browser'
import { Promotion } from '../../models/promotion.model';
import { PromotionService } from '../../services/promotion.service';
import { CommonHelper } from '../../helpers/common-helper';
import { PromotionListPage } from '../promotion-list/promotion-list';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorHelper } from '../../helpers/validator-helper';
import { PromotionHelper } from '../../helpers/promotion-helper';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'page-promotion-create',
  templateUrl: 'promotion-create.html'
})

export class PromotionCreatePage implements OnInit {
  isLoading = false;
  promotionImgUrl = AppSetting.StaticRoot + AppUploadUrl.PromotionUploadUrl;
  file: File = null;
  accessToken: string;
  item: Promotion = new Promotion();
  isUpdating: boolean = false;
  imageName: any;
  fromDateInitial: any;
  toDateInitial: any;
  //
  currencyHelper = CurrencyHelper;
  commonHelper = CommonHelper;
  validatorHelper = ValidatorHelper;
  promotionHelper = PromotionHelper;
  //
  promotionForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    private authService: AuthService,
    private promotionService: PromotionService,
    private translateService: TranslateService,
    private uiHelper: UIHelper,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private sanitizer: DomSanitizer,
    public formBuilder: FormBuilder,
    private viewCtrl: ViewController
  ) {
    this.promotionForm = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      dateFrom: ['', Validators.compose([Validators.required])],
      dateTo: ['', Validators.compose([this.validatorHelper.hasValidPromotionDateTo, Validators.required])],
      isActive: [],
    }, { validator: this.validatorHelper.hasValidDateFromBeforeDateTo('dateFrom', 'dateTo') });
  }


  ngOnInit() {
    this.accessToken = this.authService.getAccessToken();
    var itemId = this.navParams.get('itemId');
    if (itemId != undefined && itemId != 0) {
      this.isUpdating = true;
      let loading = this.uiHelper.showLoading(this.translateService.instant('loading'));
      this.promotionService.getPromotionById(itemId)
        .then(res => {
          this.uiHelper.hideLoading(loading);
          var success = res['success'];
          if (success) {
            this.item = res['data'];
            var temp_path = `${AppSetting.StaticRoot}${AppUploadUrl.PromotionUploadUrl}${this.item.imageName}`;
            this.imageName = this.sanitizer.bypassSecurityTrustStyle("url('" + temp_path + "')");
          }
        });
    } else {
      var d = new Date();
      this.fromDateInitial = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
      this.toDateInitial = new Date(new Date(this.fromDateInitial).getTime() + 60000).toISOString()
    }
  }

  addOrUpdate(): void {
    var self = this;
    if (this.item.isActive) {
      this.item.status = PromotionStatus.Valid;
      self.uiHelper.confirmAlert('Bạn có chắc chắn chạy khuyến mãi này?')
        .then(ok => {
          if (ok) self.savePromotion();
        })
    } else {
      self.savePromotion();
    }

  }

  savePromotion() {
    this.submitAttempt = true;
    let loading = this.uiHelper.showLoading();
    // Upload image
    let formData: FormData = null;
    if (this.file != null) {
      formData = new FormData();
      formData.append('uploadFile', this.file, this.file.name);
    }
    this.promotionService.savePromotion(this.item, formData)
      .then((success: boolean) => {
        if (success) {
          this.uiHelper.hideLoading(loading);
          this.navCtrl.setRoot(PromotionListPage);
        }
      });
  }

  fileChange(event): void {
    let _URL = window.URL;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      var temp_path = _URL.createObjectURL(this.file);
      this.imageName = this.sanitizer.bypassSecurityTrustStyle("url('" + temp_path + "')");
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  delete() {
    this.uiHelper.confirmAlert('Bạn có chắc chắn muốn xóa khuyến mãi này?')
      .then(ok => {
        if (ok) {
          let loading = this.uiHelper.showLoading();
          this.promotionService.delete(this.item._id).then(res => {
            //[TODO] redirect to promotion page
            this.uiHelper.hideLoading(loading);
            this.navCtrl.setRoot(PromotionListPage);
          })
        }
      })
  }
}
