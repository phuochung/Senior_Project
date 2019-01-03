export class Menu {
    _id: string;
    name: string;
    description: string;
    thumbnail: string;
    price: any;
    unit: string;
    unitRef: string;
    rate: string;
    categoryId: string;
    category: any;
    canShip: boolean;
    isNewItem: boolean;
    isDeleted: boolean;
    isFood: boolean;

    constructor() {
    }
}