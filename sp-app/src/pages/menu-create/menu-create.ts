import { UIHelper } from './../../helpers/ui-helper';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform, Events, NavParams } from 'ionic-angular';
import { MenuService } from '../../services/menu.service';
import { AppUploadUrl, AppSetting } from '../../app/constants';
import { CurrencyHelper } from '../../helpers/currency-helper';
import { Menu } from '../../models/menu.model';
import { DomSanitizer } from '@angular/platform-browser'
import { MenuListPage } from '../menu-list/menu-list';
import { ValidatorHelper } from '../../helpers/validator-helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../services/translate.service';

declare var $: any;

@Component({
  selector: 'page-menu-create',
  templateUrl: 'menu-create.html'
})

export class MenuCreatePage implements OnInit {
  isLoading = false;
  menuImgUrl = AppSetting.StaticRoot + AppUploadUrl.MenuUploadUrl;
  file: File = null;
  item: Menu = new Menu();
  act: string = 'add';
  thumbnail: any;
  price: any;
  isFood: boolean = true;
  hiddenSearchEl: string = 'none';
  menuForm: FormGroup;
  submitAttempt: boolean = false;
  searchCategoryAttempt: boolean = false;
  //
  currencyHelper = CurrencyHelper;
  validatorHelper = ValidatorHelper;

  constructor(
    private menuService: MenuService,
    private translateService: TranslateService,
    private uiHelper: UIHelper,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private sanitizer: DomSanitizer,
    public formBuilder: FormBuilder
  ) {
    this.menuForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(100), Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([this.validatorHelper.hasValidPrice, Validators.required])],
    });
  }

  ngOnInit() {
    this.isFood = this.navParams.get('isFood');
    var itemId = this.navParams.get('itemId');
    if (itemId != undefined && itemId != 0) {
      this.act = 'update';
      let loading = this.uiHelper.showLoading(this.translateService.instant('loading'));
      this.menuService.getMenuById(itemId)
        .then(res => {
          this.uiHelper.hideLoading(loading);
          this.item = res;
          this.price = this.currencyHelper.getPrice(this.item.price);
          var temp_path = `${AppSetting.StaticRoot}${AppUploadUrl.MenuUploadUrl}${this.item.thumbnail}`;
          this.thumbnail = this.sanitizer.bypassSecurityTrustStyle("url('" + temp_path + "')");
        });
    }
  }

  hideSearchEl(): void {
    this.hiddenSearchEl = 'none';
  }

  addOrUpdate(): void {
    this.isLoading = true;
    this.submitAttempt = true;
    let loading = this.uiHelper.showLoading();
    let formData: FormData = null;
    if (this.file != null) {
      formData = new FormData();
      formData.append('uploadFile', this.file, this.file.name);
    }
    var multiIds = [this.item._id];
    this.item.price = this.currencyHelper.convertMoneyToNumber(this.price);
    this.item.isFood = this.isFood;
    this.menuService.addItemToMenu(this.item, multiIds, this.act, formData)
      .then((success: boolean) => {
        this.isLoading = false;
        this.uiHelper.hideLoading(loading);
        this.navCtrl.setRoot(MenuListPage);
      });
  }

  remove(id): void {
    var messToTransalte = 'are-you-sure-you-want-to-remove-this-item';
    this.uiHelper.confirmAlert(messToTransalte, false)
      .then(res => {
        if (res) {
          let loading = this.uiHelper.showLoading();
          this.menuService.deleteMenuById(id)
            .then((success: boolean) => {
              this.isLoading = false;
              this.uiHelper.hideLoading(loading);
              this.navCtrl.setRoot(MenuListPage);
            });
        }
      })
  }

  fileChange(event): void {
    let _URL = window.URL;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      var temp_path = _URL.createObjectURL(this.file);
      this.thumbnail = this.sanitizer.bypassSecurityTrustStyle("url('" + temp_path + "')");
    }
  }
}
