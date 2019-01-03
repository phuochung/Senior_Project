import { DeliveryService } from './../../services/delivery.service';
import { FaqListPage } from './../faq-list/faq-list';
import { SearchingStatus, AppSetting } from './../../app/constants';
import { ReservationService } from './../../services/reservation.service';
import { PromotionService } from './../../services/promotion.service';
import { PromotionListPage } from './../promotion-list/promotion-list';
import { MenuListPage } from './../menu-list/menu-list';
import { RequestListPage } from './../request-list/request-list';
import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { Criteria } from '../../models/criteria.model';
import { AuthService } from '../../services/auth.service';
import { DateTimeHelper } from '../../helpers/datetime-helper';
import { CustomerService } from '../../services/customer.service';
import { CustomerRequestChatPage } from '../customer-request-chat/customer-request-chat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dateTimeHelper = DateTimeHelper;
  requestListPage = RequestListPage;
  menuListPage = MenuListPage;
  promotionListPage = PromotionListPage;
  faqListPage = FaqListPage
  customerRequestChat = CustomerRequestChatPage;

  promotionsCount = '...';
  deliveriesCount = '...';
  reservationsCount = '...';
  deliveryAndReservationCount = '...';
  customerRequestingChatCount = '...';

  constructor(
    private authService: AuthService,
    private promotionService: PromotionService,
    private deliveryService: DeliveryService,
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private navCtrl: NavController,
    private events: Events

  ) { }

  getPromotionCount() {
    let promotionCriteria = new Criteria();
    promotionCriteria.itemPerPage = AppSetting.UnlimitedItemPerPage;
    this.promotionService.getAllPromotions(this.authService.getAccessToken(), promotionCriteria).then((result: any) => {
      if (result.success) {
        var data = result.data;
        this.promotionsCount = data.promotions.length;
      }
    }).catch(error => {
      this.promotionsCount = '0';
      console.log(error);
    });
  }

  getDeliveryAndReservationsCount() {
    var reservationCriteria = new Criteria();
    reservationCriteria.searchText = SearchingStatus.Submitted;
    reservationCriteria.itemPerPage = AppSetting.UnlimitedItemPerPage;

    this.reservationService.getAllReservations(this.authService.getAccessToken(), reservationCriteria).then((result: any) => {
      if (result.success) {
        var data = result.data;
        this.deliveryAndReservationCount = data.length;
      }
      let deliveryCriteria = new Criteria();
      deliveryCriteria.itemPerPage = AppSetting.UnlimitedItemPerPage;
      this.deliveryService.getAllDeliveries(this.authService.getAccessToken(), deliveryCriteria).then(res => {
        if (res['success']) {
          this.deliveryAndReservationCount += res['data'].length;
        }
      })
    }).catch(error => {
      this.deliveryAndReservationCount = '0';
      console.log(error);
    });
  }

  ionViewDidLoad() {
    this.getDeliveryAndReservationsCount();
    this.getPromotionCount();
    this.countCustomerRequestingChat();
  }

  openPageAsRoot(page) {
    this.events.publish('openPageFromHome', page)
  }

  openPage(page, passingObject?) {
    this.navCtrl.push(page, passingObject);
  }

  countCustomerRequestingChat() {
    this.customerService.getCustomersRequestingChat(this.authService.getAccessToken()).then(res => {
      this.customerRequestingChatCount = res && res['success'] ? res['data'].length : 0;
    })
  }
}
