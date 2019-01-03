import { UIHelper } from './../../helpers/ui-helper';
import { ReservationDeclinePage } from './../reservation-decline/reservation-decline';
import { ReservationHelper } from './../../helpers/reservation-helper';
import { ReservationStatus } from './../../app/constants';
import { ReservationDetailsPage } from './../reservation-details/reservation-details';
import { ReservationService } from './../../services/reservation.service';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-reservation-list',
  templateUrl: 'reservation-list.html'
})

export class ReservationListPage implements OnInit {
  items = [];
  filteredItems = [];
  statusFilter = "all";
  isLoading = false;
  currentPage = 0;
  totalPage = 1;
  navCtrl: NavController;

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService,
    private reservationHelper: ReservationHelper,
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
    this.bindReservations();
  }

  bindReservations() {
    this.isLoading = true;
    if (this.currentPage + 1 > this.totalPage) {
      this.isLoading = false;
      return;
    }

    this.reservationService.getReservations(this.authService.getAccessToken(), ++this.currentPage).then((result: any) => {
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

  openDetails(item: any) {
    this.navCtrl.push(ReservationDetailsPage, {
      item: item
    })
  }

  accept(event: Event, item: any) {
    this.reservationHelper.acceptItem(item);
    event.stopPropagation();
  }

  decline(event: Event, item: any) {
    this.navCtrl.push(ReservationDeclinePage, {
      item: item
    })
    event.stopPropagation();
  }

  isSubmitted(item) {
    return item.status == ReservationStatus.Submitted
  }

  getStatusAsString(item) {
    return this.reservationHelper.converStatusEnumToString(item.status);
  }

  getIconByStatus(item) {
    return this.reservationHelper.getIconByStatus(item.status);
  }

  doFilter() {
    let self = this;
    this.filteredItems = this.items.filter(function (item) {
      if (self.statusFilter == "all") return true;
      return (self.reservationHelper.converStatusEnumToString(item.status) == self.statusFilter);
    });
  }

  loadMore() {
    this.bindReservations();
  }
}
