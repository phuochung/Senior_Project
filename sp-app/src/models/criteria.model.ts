import { AppSetting } from './../app/constants';
export class Criteria {
    currentPage: number;
    totalPage: number;
    itemPerPage: number;
    sortColumn: string;
    sortDirection: string;
    searchText: string;

    constructor(private current?: number, private ipp?: number) {
        current = current == null ? 0 : current;
        ipp = ipp == null ? AppSetting.MaxItemPerPage : ipp;
        this.currentPage = current;
        this.itemPerPage = ipp;
        this.totalPage = 1;
        this.searchText = '';
    }
}