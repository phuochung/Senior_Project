import { FaqListPage } from './../pages/faq-list/faq-list';
import { DeliveryService } from './../services/delivery.service';
import { PromotionListPage } from './../pages/promotion-list/promotion-list';
import { RequestListPage } from './../pages/request-list/request-list';
import { HomePage } from './../pages/home/home';
import { ReservationDeclinePage } from './../pages/reservation-decline/reservation-decline';
import { ReservationHelper } from './../helpers/reservation-helper';
import { ReservationDetailsPage } from './../pages/reservation-details/reservation-details';
import { MenuListPage } from '../pages/menu-list/menu-list';
import { MenuCreatePage } from '../pages/menu-create/menu-create';
import { ReservationService } from './../services/reservation.service';
import { HttpModule } from '@angular/http';
import { AuthService } from './../services/auth.service';
import { LoginPage } from './../pages/login/login';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReservationListPage } from '../pages/reservation-list/reservation-list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UIHelper } from '../helpers/ui-helper';
import { MenuService } from '../services/menu.service';
import { MenuHelper } from '../helpers/menu-helper';
import { PromotionService } from '../services/promotion.service';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { PromotionCreatePage } from '../pages/promotion-create/promotion-create';
import { LocalizationProvider } from '../providers/localization.provider';
import { TranslatePipe } from '../helpers/translate-helper';
import { TranslateService } from '../services/translate.service';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SharedModule } from '../directives/shared.module';
import { DeliveryListPage } from '../pages/delivery-list/delivery-list';
import { DeliveryDetailsPage } from '../pages/delivery-details/delivery-details';
import { DeliveryDeclinePage } from '../pages/delivery-decline/delivery-decline';
import { DeliveryHelper } from '../helpers/delivery-helper';
import { FaqService } from '../services/faq.service';
import { FaqUpdatePage } from '../pages/faq-update/faq-update';
import { RegisterPage } from '../pages/register/register';
import { CustomerService } from '../services/customer.service';
import { CustomerRequestChatPage } from '../pages/customer-request-chat/customer-request-chat';

export function localizationProviderFactory(local: LocalizationProvider) {
  return () => local.get();
}

@NgModule({
  declarations: [
    MyApp,
    ReservationListPage,
    ReservationDetailsPage,
    ReservationDeclinePage,
    DeliveryListPage,
    DeliveryDetailsPage,
    DeliveryDeclinePage,
    MenuListPage,
    MenuCreatePage,
    RequestListPage,
    LoginPage,
    HomePage,
    PromotionListPage,
    PromotionCreatePage,
    FaqListPage,
    FaqUpdatePage,
    TranslatePipe,
    RegisterPage,
    CustomerRequestChatPage
  ],
  imports: [
    IonicImageViewerModule,
    BrowserModule,
    HttpModule,
    BrMaskerModule,
    SharedModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: ''
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReservationListPage,
    ReservationDetailsPage,
    ReservationDeclinePage,
    DeliveryListPage,
    DeliveryDetailsPage,
    DeliveryDeclinePage,
    MenuListPage,
    MenuCreatePage,
    RequestListPage,
    LoginPage,
    HomePage,
    PromotionListPage,
    PromotionCreatePage,
    FaqListPage,
    FaqUpdatePage,
    RegisterPage,
    CustomerRequestChatPage
  ],
  providers: [
    PhotoViewer,
    StatusBar,
    SplashScreen,
    // Services
    AuthService,
    ReservationService,
    MenuService,
    PromotionService,
    DeliveryService,
    FaqService,
    // Helpers
    DeliveryHelper,
    ReservationHelper,
    MenuHelper,
    UIHelper,
    TranslateService,
    CustomerService,
    // Plugin
    PhotoLibrary,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocalizationProvider,
    { provide: APP_INITIALIZER, useFactory: localizationProviderFactory, deps: [LocalizationProvider], multi: true },
  ]
})
export class AppModule { }
