export class AppSetting {
    public static appName = "SPApp";
    public static APIHost = "https://fsa-server.herokuapp.com";
    public static StaticRoot = "http://res.cloudinary.com/fsa-server"
    // public static APIHost = "http://localhost:3000";
    // public static StaticRoot = "http://localhost:3000";
    public static MaxItemPerPage = 20;
    public static UnlimitedItemPerPage = 10000;
}

export class AppUploadUrl {
    public static BackgroundUploadUrl = '/image/upload/bg';
    public static MenuUploadUrl = "/image/upload/menu/";
    public static PromotionUploadUrl = "/image/upload/promotion/";
    public static GalleryUploadUrl = "/image/upload/gallery/";
}

export class LocalStorageSetting {
    public static accessTokenKey = "accessTokenKey";
    public static deviceToken = "deviceToken";
    public static currencyKey = "currencyKey";
    public static providerKey = "provider";
    public static localizationKey = "localization";
    public static languageKey = "lang";
}

export class CurrencyConstants {
    public static THOUSANDS_SEPARATOR = ",";
}

export enum PromotionStatus {
    Draft,
    Pending,
    Valid,
    NotYet,
    Expired,
    Stopped
}

export enum ReservationStatus {
    Pending = 0,
    Submitted = 1,
    Accepted = 2,
    Declined = 3,
    Cancelled = 4
}

export enum DeliveryStatus {
    Pending = 0,
    Submitted = 1,
    Accepted = 2,
    Declined = 3,
    Cancelled = 4
}

export enum ReservationAction {
    Accept = 'accept',
    Decline = 'decline'
}

export enum DeliveryAction {
    Accept = 'accept',
    Decline = 'decline'
}

export enum SearchingStatus {
    Available = "Available",
    NotAvailable = "Not available",
    Used = "Used",
    Success = "Success",
    Failed = "Failed",
    Expired = "Expired",
    Uncompleted = "Uncompleted",
    Completed = "Completed",
    Submitted = "Submitted",
    Accepted = "Accepted",
    NotPending = "Not Pending",
    Active = "Active"
}

export enum MenuType {
    Food = 0,
    Drink = 1
}

export enum Language {
    VI = "vi",
    EN = "en"
}

export enum ChartType {
    Day = 0,
    Week = 1,
    Month = 2
}