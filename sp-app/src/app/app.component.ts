import { FaqListPage } from './../pages/faq-list/faq-list';
import { AppSetting, AppUploadUrl } from './constants';
import { AuthService } from './../services/auth.service';
import { PromotionListPage } from './../pages/promotion-list/promotion-list';
import { HomePage } from './../pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController } from 'ionic-angular';
import { LoginPage } from './../pages/login/login';
import { MenuListPage } from '../pages/menu-list/menu-list';
import { RequestListPage } from '../pages/request-list/request-list';
import { TranslateService } from '../services/translate.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  showSideBar: boolean = true;

  @ViewChild('content') nav: NavController;
  menuItems: any = [
    { title: "home", page: HomePage, isActive: true },
    { title: "menu", page: MenuListPage, isNewSection: true },
    { title: "request-list", page: RequestListPage },
    { title: "promotions", page: PromotionListPage },
    { title: "faqs", page: FaqListPage },
  ]

  provider = {
    name: '...',
    address: '...',
    background: 'assets/imgs/no-background.png'
  }

  constructor(
    public authService: AuthService,
    private translateService: TranslateService,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    events: Events,
  ) {
    platform.ready().then(() => {
      //Notifications
      statusBar.styleDefault();
      statusBar.hide();
      splashScreen.hide();
      this.loadProviderInfo();
    });

    events.subscribe('openPageFromHome', (page) => {
      this.openPage(page);
    })

    events.subscribe('changeLanguage', (lang) => {
      this.translateService.use(lang);
    })
  }

  private setActiveMenuByPage(page) {
    this.menuItems.forEach(menuItem => {
      menuItem.isActive = menuItem.page == page;
    });
  }

  public loadProviderInfo() {
    let provider = this.authService.getProvider();
    if (!provider) {
      return;
    }

    this.provider = provider;
    if (this.provider.background) {
      this.provider.background = `${AppSetting.StaticRoot}${AppUploadUrl.BackgroundUploadUrl}/${this.provider.background}`;
    }
  }

  openPage(page) {
    if (page) {
      this.setActiveMenuByPage(page);
      this.nav.setRoot(page);
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.openPage(LoginPage);
    }).catch(err => console.log(err));
  }
}
