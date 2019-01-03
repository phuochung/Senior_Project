import { PromotionStatus } from './../app/constants';
export class Promotion {
    _id: string;
    title: string;
    description: string;
    imageName: string;
    dateFrom: Date;
    dateTo: Date;
    status: number;
    isActive: boolean;
    isDeleted: boolean;

    constructor() {
        this.status = PromotionStatus.Draft;
    }
}