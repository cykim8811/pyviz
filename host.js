const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const socketIO = require('socket.io')(server, { cors: { origin: "*" } });


// Browser side connection
app.use(cors())
const port = process.env.PORT || 7002;

// socket이 연결되었을 때
socketIO.on('connection', (socket) => {
    console.log('client connected')
    socketIO.emit('connected', socket.id);

});

server.listen(port, () => {
    console.log('Socket IO server listening on port' + port);
})


const net = require('net');

// TCP Server
const hostServer = net.createServer((sock) => {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', (data) => {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
    });
    sock.on('close', (data) => {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
})

hostServer.listen(7003, '127.0.0.1', () => {
    console.log('TCP Server is running on port 7003.');
});

hostServer.on('error', (err) => {
    console.log(err);
});