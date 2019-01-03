import { DeliveryDetailsPage } from './../delivery-details/delivery-details';
import { DeliveryDeclinePage } from './../delivery-decline/delivery-decline';
import { UIHelper } from './../../helpers/ui-helper';
import { DeliveryStatus } from './../../app/constants';
import { DeliveryHelper } from './../../helpers/delivery-helper';
import { AuthService } from './../../services/auth.service';
import { DeliveryService } from './../../services/delivery.service';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';

@Component({
  selector: 'page-delivery-list',
  templateUrl: 'delivery-list.html'
})
export class DeliveryListPage implements OnInit {
  items = [];
  filteredItems = [];
  statusFilter = "all";
  isLoading = false;
  currentPage = 0;
  totalPage = 1;
  navCtrl: NavController;

  constructor(
    private authService: AuthService,
    private deliveryService: DeliveryService,
    private deliveryHelper: DeliveryHelper,
    private uiHelper: UIHelper,
    public platform: Platform,
    public subNavCtrl: NavController,
    public events: Events
  ) {
    this.navCtrl = this.subNavCtrl.parent.parent;
  }

  private updateItemToList(newItem) {
    for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
      if (this.items[itemIndex]._id == newItem._id) {
        this.items[itemIndex] = newItem;
        this.doFilter();
        return;
      }
    }

    this.items.unshift(newItem);
    this.doFilter();
  }

  ngOnInit() {
    this.bindDeliveries();
  }

  bindDeliveries() {
    this.isLoading = true;
    if (this.currentPage + 1 > this.totalPage) {
      this.isLoading = false;
      return;
    }
    this.deliveryService.getDeliveries(this.authService.getAccessToken(), ++this.currentPage).then((result: any) => {
      if (result.success) {
        this.totalPage = result.totalPage;
        this.items = this.items.concat(result.data);
      }
      this.isLoading = false;
    }).then(() =>
      this.doFilter()
    ).catch(error => {
      this.isLoading = false;
      this.uiHelper.alert(error);
    });
  }


  isSubmitted(item) {
    return item.status == DeliveryStatus.Submitted;
  }

  getStatusAsString(item) {
    return this.deliveryHelper.converStatusEnumToString(item.status);
  }

  getIconByStatus(item) {
    return this.deliveryHelper.getIconByStatus(item.status);
  }

  openDetails(item: any) {
    this.navCtrl.push(DeliveryDetailsPage, {
      item: item
    })
  }

  accept(event: Event, item: any) {
    this.deliveryHelper.acceptItem(item);
    event.stopPropagation();
  }

  decline(event: Event, item: any) {
    this.navCtrl.push(DeliveryDeclinePage, {
      item: item
    })
    event.stopPropagation();
  }

  doFilter() {
    let self = this;
    this.filteredItems = this.items.filter(function (item) {
      if (self.statusFilter == "all") return true;
      return (self.deliveryHelper.converStatusEnumToString(item.status) == self.statusFilter);
    });
  }

  loadMore() {
    this.bindDeliveries();
  }
}
