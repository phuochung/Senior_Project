const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const intentSchema = new Schema({
    field: { type: String, unique: true, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { collection: "intents" });

mongoose.model("Intent", intentSchema);