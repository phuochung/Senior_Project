const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const currencySchema = new Schema({
    code: String,
    description: String,
    rate: Number,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    createdBy: Schema.Types.ObjectId,
    updatedAt: { type: Date, default: new Date() },
    updatedBy: Schema.Types.ObjectId
}, { collection: "currencies" });

mongoose.model("Currency", currencySchema);