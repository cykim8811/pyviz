
# TCP Socket client

import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(('127.0.0.1', 7003))

# Send a message to the server

sock.sendall(b'Hello, world')

# Receive a message from the server

data = sock.recv(1024)

# Close the socket

sock.close()