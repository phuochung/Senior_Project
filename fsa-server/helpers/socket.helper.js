module.exports.send = (socket, opcode, returnCode, data) => {
    let response = {
        opcode: opcode,
        returnCode: returnCode,
        data: data
    };

    socket.send(JSON.stringify(response));
}