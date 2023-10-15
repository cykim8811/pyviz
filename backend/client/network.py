
import socket
import json

class Client:
    def __init__(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.events = {}

    def connect(self, host, port):
        self.sock.connect((host, port))
    
    def on(self, event, callback):
        self.events[event] = callback

    def emit(self, event, data):
        self.sock.send(json.dumps({'event': event, 'data': data}).encode())

    def listen(self):
        while True:
            data = self.sock.recv(4)
            if not data: break
            length = int.from_bytes(data, byteorder='little')
            data = self.sock.recv(length).decode()
            data = json.loads(data)
            if data['event'] in self.events:
                self.events[data['event']](data['data'])
            else:
                print(f'\033[93m[WARNING]\033[0m No event "{data["event"]}" registered. Ignoring message.')

