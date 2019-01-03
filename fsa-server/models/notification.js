const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    enums = require('../common/enums'),
    NotificationType = enums.NotificationType;

const notificationSchema = new Schema({
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    ship: { type: Schema.Types.ObjectId, ref: 'Ship', default: null },
    book: { type: Schema.Types.ObjectId, ref: 'Book', default: null },
    type: { type: NotificationType, default: NotificationType.Others },
    isNotified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedAt: { type: Date, default: new Date() },
    updatedBy: { type: Schema.Types.ObjectId, default: null }
}, { collection: "notifications" });

mongoose.model("Notification", notificationSchema);