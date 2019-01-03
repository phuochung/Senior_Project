const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    constants = require("../common/constants"),
    Language = constants.Lang;

const localizationSchema = new Schema({
    field: {
        type: String,
        unique: true,
        required: true
    },
    values: [{
        language: {
            type: Language,
            default: Language.VI
        },
        content: String
    }],
    isDeleted: Boolean,
    createdAt: Date,
    createdBy: String,
    updatedAt: Date,
    updatedBy: String
}, {
    collection: "localization"
});

mongoose.model("Localization", localizationSchema);