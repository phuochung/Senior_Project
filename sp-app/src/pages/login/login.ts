import { MyApp } from './../../app/app.component';
import { HomePage } from './../home/home';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Events } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LocalStorageHelper } from '../../helpers/localstorage-helper';
import { LocalStorageSetting } from '../../app/constants';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage implements OnInit {
  lang: String = LocalStorageHelper.getStoredValueByKey(LocalStorageSetting.languageKey);
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private authService: AuthService,
    private translateService: TranslateService,
    private myApp: MyApp,
    public events: Events
  ) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      enableBackdropDismiss: true,
      dismissOnPageChange: true
    });
    loading.present();

    this.authService.verifyToken(this.authService.getAccessToken()).then(success => {
      if (success) {
        this.navCtrl.setRoot(HomePage);
      } else {
        loading.dismiss();
      }
    }).catch(error => {
      loading.dismiss();
      console.log(error);
    });
  }

  ngOnInit() {
    if (!this.lang) this.lang = "vi";
  }

  user: any = {};
  errorMessage: string;

  validateInput() {
    this.errorMessage = "";
    if (this.user.username === "" || this.user.username === undefined) {
      this.errorMessage = this.translateService.instant('error-username-required');
      return false;
    }

    if (this.user.password === "" || this.user.password === undefined) {
      this.errorMessage = this.translateService.instant('error-password-required');
      return false;
    }

    return true;
  }

  login() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      enableBackdropDismiss: true,
      dismissOnPageChange: true
    });
    loading.present();

    if (!this.validateInput()) {
      loading.dismiss();
      return;
    }

    this.authService.login(this.user.username, this.user.password).then(data => {
      loading.dismiss();
      if (data) {
        this.myApp.loadProviderInfo();
        this.navCtrl.setRoot(HomePage);
      } else {
        this.errorMessage = this.translateService.instant('error-username-or-password-incorrect');
      }
    }).catch(error => {
      loading.dismiss();
      console.log(error);
    });
  }

  goToRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  setLang(e) {
    LocalStorageHelper.storeValueByKey(LocalStorageSetting.languageKey, e);
    this.translateService.use(e);
    this.events.publish('changeLanguage', e);
    this.navCtrl.insert(0, this.navCtrl.getActive().component);
    this.navCtrl.popToRoot();
  }
}
