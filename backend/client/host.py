
from network import Client


sock = Client()
sock.connect('localhost', 7003)

sock.on('connect', lambda data: print('connected to server'))

sock.on('disconnect', lambda data: print('disconnected from server'))

sock.on('message', lambda data: print('message from server:', data))

sock.emit('message', 'hello from client')

sock.listen()