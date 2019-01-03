import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { FaqService } from '../../services/faq.service';
import { FaqUpdatePage } from '../faq-update/faq-update';

@Component({
  selector: 'page-faq-list',
  templateUrl: 'faq-list.html',
})
export class FaqListPage implements OnInit {
  items = [];
  isLoading: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private faqService: FaqService,
    ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(){
    this.isLoading = true;
    this.faqService.getAllAnsweFaq().then(res =>{
      this.isLoading = false;
      if(res && res['success']){
        this.formatData(res['data']);
      }
    })
  }

  formatData(answerFaqs){
    answerFaqs.forEach(answerFaq => {
      let item = {
        _id: answerFaq._id,
        description: answerFaq.intent[0].description,
        content: answerFaq.content,
      }
      this.items.push(item);
    });
  }

  goToUpdateAnswerFaqPage(item){
    this.navCtrl.push(FaqUpdatePage, { item });
  }
}
