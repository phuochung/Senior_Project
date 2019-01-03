const Localization = require('mongoose').model('Localization');

let fields;

module.exports.loadFields = (callback) => {
    if (fields) {
        if (callback) callback;
        return;
    };
    Localization.find().then(locals => {
        // don't remove this console
        console.log('LOCALIZATION CACHED!');
        fields = locals;
        if (callback) callback();
    });
}

module.exports.getField = (fieldName, language) => {
    language = language ? language.toLowerCase() : 'vi';
    for (var i = 0; i < fields.length; i++) {
        if(fields[i].field == fieldName){
            var enContent = "";
            for(var j = 0; j < fields[i].values.length; j++){
                if(fields[i].values[j].language == language){
                    return fields[i].values[j].content;
                }
                if(fields[i].values[j].language == "en"){
                    enContent = fields[i].values[j].content;
                }
            }
            return enContent;
        }
    }
    return fieldName;
}

module.exports.getAll = () =>{
    return fields;
}