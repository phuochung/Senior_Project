var sockets = {};

// DEMO NOTIFY SHIP IN SP SYSTEM
module.exports.notifyShip = (ws, req) => {
    ws.on('message', function (msg) {
    });

    let providerId = req.body.providerId.toString();
    if (!sockets['ship']) sockets['ship'] = {};
    sockets['ship'][providerId] = ws;
}

module.exports.notifyBook = (ws, req) => {
    ws.on('message', function (msg) {
    });

    let providerId = req.body.providerId.toString();
    if (!sockets['book']) sockets['book'] = {};
    sockets['book'][providerId] = ws;
}


module.exports.sockets = sockets;

