const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const socketIO = require('socket.io')(server, { cors: { origin: "*" } });

const { showLog, showWarn, showErr } = require('./utils');

const network = require('./network');


// Browser side connection
app.use(cors())
const port = process.env.PORT || 7002;

// socket이 연결되었을 때
socketIO.on('connection', (socket) => {
    console.log('client connected')
    socketIO.emit('connected', socket.id);

});

server.listen(port, () => {
    showLog('PyViz', `Server is running on port ${port}`);
})

const Docker = require('dockerode');

class Session{
    constructor(image, port) {
        this.image = image;
        this.port = port;
        this.container = null;
        this.stream = null;
    }

    async start() {
        const docker = new Docker();
        const container = await docker.createContainer({
            Image: this.image,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            OpenStdin: true,
            StdinOnce: false
        });
        await container.start();

        // Attach to the container
        const stream = await container.attach({
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true
        });
        this.stream = stream;

        // Handle container output
        stream.on('data', (buffer) => {
            const header = buffer.slice(0, 4);
            const length = header.readUInt32LE(0);
            const message = buffer.slice(4, 4 + length);
            const payload = JSON.parse(message.toString());
            const event = payload.event;
            const data = payload.data;

            this.receive(event, data);
        });

        this.container = container;

        this.send('connect', { port: this.port });
    }
    
    receive(event, data) {
        showLog('Container', `Received event: ${event}, data: ${data}`);
        
    }

    send(event, data) {
        const payload = JSON.stringify({ event, data });
        const header = Buffer.alloc(4);
        header.writeUInt32LE(payload.length, 0);
        this.stream.write(Buffer.concat([header, Buffer.from(payload)]));
    }

    async stop() {
        if (this.container === null) {
            console.log('Container is not running');
            return;
        }
        // Check if stopped
        const { State: { Status } } = await this.container.inspect();
        if (Status === 'paused') await this.container.unpause();
        if (Status === 'running') {
            await this.container.stop();
        }
        await this.container.remove();
    }
}

const session = new Session('pyviz-container', 7003);
session.start();

async function beforeShutdown() {
    showLog('PyViz', 'Cleaning up...');
    await session.stop();
    showLog('PyViz', 'container server stopped');
    process.exit();
}

let sigintReceived = false;
process.on('SIGINT', () => {
    if (sigintReceived) {
        showWarn('PyViz', 'SIGINT received. Forcefully shutting down...');
        process.exit();
    }
    sigintReceived = true;
    showWarn('PyViz', 'SIGINT received. Press Ctrl+C again to forcefully shut down...');
    setTimeout(() => {
        sigintReceived = false;
    }, 1000);
    beforeShutdown();
});
process.on('SIGTERM', beforeShutdown);
process.on('uncaughtException', (err) => {
    showErr('PyViz', 'Uncaught exception');
    showErr('PyViz', err);
    beforeShutdown();
});

