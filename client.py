import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

client.connect(("localhost", 8081))

while True:
    try:
        client.send(input("Message: ").encode("utf-8"))
        msg = client.recv(1024).decode("utf-8")

        if msg == "quit":
            break
        else:
            print(msg)

    except:
        client.send("quit".encode("utf-8"))
