import { Injectable } from "@angular/core";

@Injectable()
export class CommonHelper {

    public static modifyPercentValue(percent): number {
        if (percent && isNaN(percent))
            return +percent.replace('%', '');
        else if (!isNaN(percent)) return percent;

        return 0;
    }

}