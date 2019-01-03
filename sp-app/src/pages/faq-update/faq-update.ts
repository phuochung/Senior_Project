import { FaqListPage } from './../faq-list/faq-list';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FaqService } from '../../services/faq.service';
import { UIHelper } from '../../helpers/ui-helper';
@Component({
  selector: 'page-faq-update',
  templateUrl: 'faq-update.html',
})
export class FaqUpdatePage implements OnInit{
  item: object = {};
  faqForm: FormGroup;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private faqService: FaqService,
    private uiHelper : UIHelper,
    ) {
    this.faqForm = this.formBuilder.group({
      content: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.item = this.navParams.get('item');
  }

  update(){
    let loading = this.uiHelper.showLoading();
    this.faqService.update(this.item).then(res =>{
      this.uiHelper.hideLoading(loading);
      this.navCtrl.setRoot(FaqListPage);
    })
  }
}
