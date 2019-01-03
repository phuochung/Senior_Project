const mongoose = require("mongoose"),
    enums = require("../common/enums"),
    PromotionStatus = enums.PromotionStatus,
    Schema = mongoose.Schema;

const promotionSchema = new Schema({
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    title: String,
    description: String,
    imageName: String,
    dateFrom: Date,
    dateTo: Date,
    status: { type: PromotionStatus, default: PromotionStatus.Draft },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    createdBy: Schema.Types.ObjectId,
    updatedAt: { type: Date, default: new Date() },
    updatedBy: Schema.Types.ObjectId
}, { collection: "promotions" });

mongoose.model("Promotion", promotionSchema);