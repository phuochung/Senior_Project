import { UIHelper } from './ui-helper';
import { AuthService } from './../services/auth.service';
import { ReservationStatus, ReservationAction, LocalStorageSetting } from './../app/constants';
import { ReservationService } from './../services/reservation.service';
import { Injectable } from "@angular/core";
import { LocalStorageHelper } from './localstorage-helper';
import { TranslateService } from '../services/translate.service';

@Injectable()
export class ReservationHelper {
    lang: String = LocalStorageHelper.getStoredValueByKey(LocalStorageSetting.languageKey);
    constructor(
        private authService: AuthService,
        private reservationService: ReservationService,
        private uiHelper: UIHelper,
        private translateService: TranslateService,
    ) {

    }

    converStatusEnumToString(statusEnum) {
        switch (statusEnum) {
            case ReservationStatus.Accepted:
                return "accepted";
            case ReservationStatus.Cancelled:
                return "cancelled";
            case ReservationStatus.Declined:
                return "declined";
            case ReservationStatus.Pending:
                return "pending";
            case ReservationStatus.Submitted:
                return "submitted";
            default:
                return "unknown";
        }
    }

    getIconByStatus(statusEnum) {
        switch (statusEnum) {
            case ReservationStatus.Accepted:
                return "checkmark-circle-outline";
            case ReservationStatus.Pending:
                return "time";
            case ReservationStatus.Submitted:
                return "time";
            default:
                return "information-circle";
        }
    }

    updateItem(item) {
        this.reservationService.updateReservation(item, this.authService.getAccessToken())
            .then((data: any) => {
                this.uiHelper.alert(data.message);
            }).catch(error => {
                this.uiHelper.alert(error);
            })
    }

    private proceedActionOnItem(action, item) {
        if (action == ReservationAction.Accept) {
            item.status = ReservationStatus.Accepted;
            this.updateItem(item);
        } else if (action == ReservationAction.Decline) {
            item.status = ReservationStatus.Declined;
            this.updateItem(item);
        } else {
            this.uiHelper.alert("This action cannot be processed");
        }
    }

    private createUpdatingItemMessage(item: any, action: string) {
        let message = '';
        if (this.lang == 'vi') {
            message = `Bạn có muốn ${this.translateService.instant(action)} đơn đặt bàn này?<br />`;
        } else {
            message = `Do you want to ${this.translateService.instant(action)} this item?<br />`;
        }
        message += `<div class="item-information">
                        <b>${this.translateService.instant('time')}: </b>${item.dateTime}
                        <br />
                            <b>${this.translateService.instant('quantity')}: </b>${item.numCus}
                        <br />
                            <b>${this.translateService.instant('note')}:</b> ${item.conditions}      
                    </div>`;
        return message;
    }

    acceptItem(item: any) {
        let action = ReservationAction.Accept;
        let actionMessage = this.createUpdatingItemMessage(item, action);
        this.uiHelper.confirmAlert(actionMessage).then(ok => {
            if (ok) {
                this.proceedActionOnItem(action, item);
            }
        });
    }

    declineItem(item: any) {
        let action = ReservationAction.Decline;
        let actionMessage = this.createUpdatingItemMessage(item, action);
        this.uiHelper.confirmAlert(actionMessage).then(ok => {
            if (ok) {
                this.proceedActionOnItem(action, item);
            }
        });
    }
}