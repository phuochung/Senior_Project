import { AppSetting } from './../app/constants';
import { AlertController, LoadingController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { TranslateService } from '../services/translate.service';

@Injectable()
export class UIHelper {
    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private translateService: TranslateService,
    ) {

    }

    showLoading(message?){
        if (!message) message =  this.translateService.instant('wait-a-minute');
        let loading = this.loadingCtrl.create({
            content: message
          });
          loading.present();
          return loading;
    }

    hideLoading(loading){
        loading.dismiss();
    }
    
    alert(message: string) {
        let alert = this.alertCtrl.create({
            title: AppSetting.appName,
            subTitle: message,
            enableBackdropDismiss: false,
            buttons: ['OK']
        });
        alert.present();
    }

    confirmAlert(message, isTranslated = true) {
        return new Promise((resolve, reject) => {
            if (!isTranslated) message = this.translateService.instant(message);
            let confirmAlert = this.alertCtrl.create({
                title: AppSetting.appName,
                message: message,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: this.translateService.instant('button-cancel'),
                        handler: () => {
                            resolve(false);
                        }
                    },
                    {
                        text: this.translateService.instant('button-ok'),
                        handler: () => {
                            resolve(true);
                        }
                    }
                ]
            });    
            confirmAlert.present();            
        })
    }
}