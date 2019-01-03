const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    enums = require("../common/enums"),
    ShipStatus = enums.ShipStatus;

const shipSchema = new Schema({
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    notes: String,
    listDish: [{
        id: Schema.Types.ObjectId,
        name: String,
        numberDishs: { type: Number, default: 0 },
        price: [{
            currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
            value: { type: Number, default: 0 }
        }],
    }],
    priceTotal: [{
        currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
        value: { type: Number, default: 0 }
    }],
    isNotified: { type: Boolean, default: false },
    address: String,
    reasonRefuse: String,
    createdAt: Date,
    isDeleted: { type: Boolean, default: false },
    telephone: String,
    orderNumber: String,
    botName: String,
    status: { type: ShipStatus, default: ShipStatus.Pending }
}, { collection: "ships" });

mongoose.model("Ship", shipSchema);