const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const menuSchema = new Schema({
    id: {
        type: Number,
        default: 0
    },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    name: String,
    description: String,
    note: String,
    thumbnail: String,
    isFood: {
        type: Boolean,
        default: true
    },
    price: [{
        currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
        value: { type: Number, default: 0 }
    }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    createdBy: Schema.Types.ObjectId,
    updatedAt: { type: Date, default: new Date() },
    updatedBy: Schema.Types.ObjectId
}, { collection: "menus" });

mongoose.model("Menu", menuSchema);