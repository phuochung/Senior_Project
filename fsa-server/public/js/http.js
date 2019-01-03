const Http = function () {
    return {
        // Http Get
        // Params: url, data, callback
        get: function (url, dt, cb) {
            Http.send(url, dt, "GET", cb);
        },

        // Http Get form data
        // Params: url, data, callback
        getForm: function (url, dt, cb) {
            Http.sendForm(url, dt, "GET", cb);
        },

        // Http Post
        // Params: url, data, callback
        post: function (url, dt, cb) {
            Http.send(url, dt, "POST", cb);
        },

        // Http Post form data
        // Params: url, data, callback
        postForm: function (url, dt, cb) {
            Http.sendForm(url, dt, "POST", cb);
        },

        // Http Send http request
        // Params: url, data, method, callback
        send: function (url, dt, mt, cb) {
            $.ajax({
                url: url,
                data: dt,
                type: mt,
                success: function (rs) {
                    if (typeof cb == "function") {
                        cb(rs);
                    }
                }
            });
        },
        // Http Send http request with form data
        // Params: url, data, method, callback
        sendForm: function (url, dt, mt, cb) {
            $.ajax({
                url: url,
                data: dt,
                type: mt,
                processData: false,
                contentType: false,
                success: function (rs) {
                    if (typeof cb == "function") {
                        cb(rs);
                    }
                }
            });
        }
    }
}();