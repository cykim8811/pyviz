
import json
import sys

class Client:
    def __init__(self):
        self.events = {}

    def on(self, event, callback):
        self.events[event] = callback

    def emit(self, event, data):
        # [4 bytes for length][data]
        data = json.dumps({'event': event, 'data': data}).encode()
        length = len(data).to_bytes(4, byteorder='little')
        sys.stdout.buffer.write(length + data)
        sys.stdout.flush()

    def listen(self):
        while True:
            data = sys.stdin.buffer.read(4)
            if not data: break
            length = int.from_bytes(data, byteorder='little')
            data = sys.stdin.buffer.read(length).decode()
            data = json.loads(data)
            if data['event'] in self.events:
                self.events[data['event']](data['data'])
            else:
                print(f'\033[93m[WARNING]\033[0m No event "{data["event"]}" registered. Ignoring message.')