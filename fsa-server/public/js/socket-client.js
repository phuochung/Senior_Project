const SocketClient = function () {
    var ws;

    function onclose() {
    }

    function onerror(err) {
    }

    return {
        connect: function (url) {
            ws = new WebSocket(url);
            ws.onclose = onclose;
            ws.onerror = onerror;
        },

        disconnect: function () {
            ws.close();
        },

        onconnect: function (callback) {
            ws.onopen = callback;
        },

        receive: function (callback) {
            ws.onmessage = function (message) {
                callback(message.data);
            }
        },

        send: function (message) {
            ws.send(message);
        }
    }
}