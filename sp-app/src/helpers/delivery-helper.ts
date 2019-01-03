import { UIHelper } from './ui-helper';
import { AuthService } from './../services/auth.service';
import { DeliveryService } from './../services/delivery.service';
import { DeliveryStatus, DeliveryAction } from './../app/constants';
import { Injectable } from '@angular/core';

@Injectable()
export class DeliveryHelper {
    constructor(
        private authService: AuthService,
        private deliveryService: DeliveryService,
        private uiHelper: UIHelper,
    ) {

    }

    converStatusEnumToString(statusEnum) {
        switch (statusEnum) {
            case DeliveryStatus.Accepted:
                return "accepted";
            case DeliveryStatus.Cancelled:
                return "cancelled";
            case DeliveryStatus.Declined:
                return "declined";
            case DeliveryStatus.Pending:
                return "pending";
            case DeliveryStatus.Submitted:
                return "submitted";
            default:
                return "unknown";
        }
    }


    getIconByStatus(statusEnum) {
        switch (statusEnum) {
            case DeliveryStatus.Accepted:
                return "checkmark-circle-outline";
            case DeliveryStatus.Pending:
                return "time";
            case DeliveryStatus.Submitted:
                return "time";
            default:
                return "information-circle";
        }
    }


    updateItem(item) {
        this.deliveryService.updateDelivery(item, this.authService.getAccessToken())
            .then((data: any) => {
                this.uiHelper.alert(data.message);
            }).catch(error => {
                this.uiHelper.alert(error);
            })
    }

    private proceedActionOnItem(action, item) {
        if (action == DeliveryAction.Accept) {
            item.status = DeliveryStatus.Accepted;
            this.updateItem(item);
        } else if (action == DeliveryAction.Decline) {
            item.status = DeliveryStatus.Declined;
            this.updateItem(item);
        } else {
            this.uiHelper.alert("This action cannot be processed");
        }
    }

    private createUpdatingItemMessage(item: any, action: string) {
        return `Do you want to ${action} this item?<br />
        <div class="item-information">
    <p>
      <b>Khách hàng: </b>${ item.customer.name}
    </p>
    <p>
      <b>Số điện thoại: </b>${ item.telephone}
    </p>
    <p>
      <b>Địa chỉ: </b>${ item.address}
    </p>
    <p>
      <b>Ước tính: </b>${ item.distance} - ${item.duration}
    </p>
    <p *ngIf="item.notes !== ''">
      <b>Ghi chú:</b> ${ item.notes}
    </p>
  </div>`;
    }

    acceptItem(item: any) {
        let action = DeliveryAction.Accept;
        let actionMessage = this.createUpdatingItemMessage(item, action);
        this.uiHelper.confirmAlert(actionMessage).then(ok => {
            if (ok) {
                this.proceedActionOnItem(action, item);
            }
        });
    }

    declineItem(item: any) {
        let action = DeliveryAction.Decline;
        let actionMessage = this.createUpdatingItemMessage(item, action);
        this.uiHelper.confirmAlert(actionMessage).then(ok => {
            if (ok) {
                this.proceedActionOnItem(action, item);
            }
        });
    }
}