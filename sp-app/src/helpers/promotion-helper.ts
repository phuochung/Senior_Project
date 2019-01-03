import { DateTimeHelper } from './datetime-helper';
import { PromotionStatus } from './../app/constants';

export class PromotionHelper {
    private static getPromotionStatus(promotion) {
        if (promotion.isActive) {
            if (promotion.status == PromotionStatus.Pending) return PromotionStatus.Pending;
            if (promotion.dateFrom && promotion.dateTo) {
                let timeStamToday = DateTimeHelper.getTimeStampToday(new Date(),'YYYYMMDDHHmmss');
                if (DateTimeHelper.getTimeStampFromDateTimeFormat(promotion.dateFrom,'YYYYMMDDHHmmss') <= timeStamToday && DateTimeHelper.getTimeStampFromDateTimeFormat(promotion.dateTo,'YYYYMMDDHHmmss') >= timeStamToday) {
                    return PromotionStatus.Valid
                } else if (DateTimeHelper.getTimeStampFromDateTimeFormat(promotion.dateFrom,'YYYYMMDDHHmmss') > timeStamToday) {
                    return PromotionStatus.NotYet;
                }
                return PromotionStatus.Expired;
            } else {
                return PromotionStatus.Valid;
            }

        } else {
            if (promotion.status == PromotionStatus.Draft) return PromotionStatus.Draft;
            else return PromotionStatus.Stopped;
        }
    }

    public static getPromotionStatusText(promotion) {
        switch (this.getPromotionStatus(promotion)) {
            case PromotionStatus.Draft:
                return 'draft';
            case PromotionStatus.Pending:
                return 'pending';
            case PromotionStatus.Valid:
                return 'valid';
            case PromotionStatus.Expired:
                return 'expired';
            case PromotionStatus.Stopped:
                return 'stopped';
            case PromotionStatus.NotYet:
                return 'notYet';
        }
    }

    public static getPromotionStatusBgCss(promotion) {
        switch (this.getPromotionStatus(promotion)) {
            case PromotionStatus.Pending:
                return "bg-orange";
            case PromotionStatus.Valid:
                return "bg-green-light";
            case PromotionStatus.NotYet:
                return "bg-orange";
            default:
                return "bg-gray-dark";
        }
    }

}