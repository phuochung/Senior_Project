const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    enums = require("../common/enums"),
    BookStatus = enums.BookStatus;

const bookSchema = new Schema({
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    dateTime: String,
    conditions: String,
    numberOfCustomer: String,
    isNotified: { type: Boolean, default: false },
    reasonRefuse: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    createdBy: Schema.Types.ObjectId,
    updatedAt: { type: Date, default: new Date() },
    updatedBy: Schema.Types.ObjectId,
    botName: String,
    status: { type: BookStatus, default: BookStatus.Pending }
}, { collection: "book" });

mongoose.model("Book", bookSchema);