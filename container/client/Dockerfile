From python:3.10-alpine

# Copy host.py, network.py into the container
COPY host.py network.py /app/

# Set the working directory to /app
WORKDIR /app

# Run host.py when the container launches
# CMD ["python3", "host.py"]
# failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: exec: "python": executable file not found in $PATH: unknown
# It should be like:
CMD ["python3", "host.py"]


EXPOSE 7003