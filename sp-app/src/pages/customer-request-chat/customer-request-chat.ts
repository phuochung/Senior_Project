import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-customer-request-chat',
  templateUrl: 'customer-request-chat.html',
})
export class CustomerRequestChatPage implements OnInit {

  isLoading: Boolean = false;
  items = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customerService: CustomerService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): any {
    this.isLoading = true;
    this.customerService.getCustomersRequestingChat(this.authService.getAccessToken()).then(res => {
      this.isLoading = false;
      if (res['success']) {
        this.items = res['data'];
      }
    })
  }

  ionViewDidLoad() {
  }

}
