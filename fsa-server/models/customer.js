const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const customersSchema = new Schema({
    fbId: String,
    name: String,
    gender: String,
    isChatWithAdmin: {
        type: Boolean,
        default: false
    },
    savedAddress: {
        id: String,
        channelId: String,
        user: {
            id: String,
            name: String
        },
        conversation: {
            id: String
        },
        bot: {
            id: String,
            name: String
        },
        serviceUrl: String
    },
    createdAt: { type: Date, default: new Date() },
}, { collection: "customers" });

mongoose.model("Customer", customersSchema);
