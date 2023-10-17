
const net = require('net');

function createServer(callback) {
    const server = net.createServer((sock) => {
        const wrapper = {
            _callbacks: {},
            emit: (event, data) => {
                const strdata = JSON.stringify({ event, data });
                const length = Buffer.byteLength(strdata);
                const buffer = Buffer.alloc(length + 4);
                buffer.writeInt32LE(length, 0);
                buffer.write(strdata, 4);
                sock.write(buffer);
            },
            on: (event, callback) => {
                wrapper._callbacks[event] = callback;
            }
        };
        sock.on('data', (data) => {
            const { event, data: eventData } = JSON.parse(data);
            if (wrapper._callbacks[event] === undefined) return;
            wrapper._callbacks[event](eventData);
        });

        callback(new Proxy(wrapper, {
            get: (target, prop) => {
                if (prop in target) return target[prop];
                return sock[prop];
            },
            set: (target, prop, value) => {
                if (prop in target) {
                    target[prop] = value;
                    return true;
                }
                sock[prop] = value;
                return true;
            }
        }));
    });
    return server;
}

exports.createServer = createServer;
