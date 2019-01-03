const HtmlEncode = function () {
    return {
        encode: function (v) {
            return $('<div/>').text(v).html();
        },
        decode: function (v) {
            return $('<div/>').html(v).text();
        }
    }
}();