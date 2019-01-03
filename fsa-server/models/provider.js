const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const providerSchema = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    tel: String,
    address: String,
    background: String,
    isActive: { type: Boolean, default: false },
    aboutUs: String,
    fanpageId: String,
    isActivedBot: { type: Boolean, default: false },
    botToken: {
        appId: String,
        appPassword: String
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    deviceTokens: [{ type: String, default: [] }],
    lang: String,
    currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    gps: {
        lat: String,
        lng: String,
    }
}, {
        collection: "providers"
    });

mongoose.model("Provider", providerSchema);

