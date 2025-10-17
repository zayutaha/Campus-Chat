import json

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from message.messages import MessageBuilder
from services import Server
from tests.test_users import InMemoryChannelRepo, InMemoryMessageRepo, InMemoryUserRepo
from user.users import UserBuilder

server = Server(InMemoryMessageRepo(), InMemoryUserRepo(), InMemoryChannelRepo())


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


clients = {}


class CreateUserRequest(BaseModel):
    name: str
    password: str


@app.post("/users")
def create_user(create_user: CreateUserRequest):
    user = (
        UserBuilder()
        .with_name(create_user.name)
        .with_password(create_user.password)
        .build()
    )
    user_id = server.add_user(user)
    return {"user_id": user_id}


@app.post("/channels")
def create_channel(title: str):
    channel_id = server.create_channel(title)
    return {"channel_id": channel_id}


@app.get("/messages/{channel_id}")
def get_messages(channel_id: int):
    try:
        messages = server.get_messages(channel_id)
        return [
            {
                "user_id": m.user_id,
                "channel_id": m.channel_id,
                "content": m.content,
            }
            for m in messages
        ]

    except:
        raise HTTPException(status_code=404, detail="Channel not found")


@app.get("/user")
def get_user(user_id: int):
    user = server.get_user(user_id)

    if user:
        return {
            "user_id": user.id,
            "name": user.name,
        }

    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.websocket("/ws/channel/{channel_id}/user/{user_id}")
async def websocket_endpoint(ws: WebSocket, channel_id: int, user_id: int):
    await ws.accept()

    if not server.get_channel(channel_id):
        await ws.send_json({"error": "Channel not found"})
        await ws.close(code=1008, reason="Channel not found")
        return

    if not server.get_user(user_id):
        await ws.send_json({"error": "User not found"})
        await ws.close(code=1008, reason="User not found")
        return

    if channel_id not in clients:
        clients[channel_id] = []

    clients[channel_id].append(ws)

    try:
        while True:
            data = await ws.receive_text()
            message = (
                MessageBuilder()
                .with_user_id(user_id)
                .with_channel_id(channel_id)
                .with_content(data)
                .build()
            )
            server.send_message(message)

            to_remove = []
            for client in clients[channel_id]:
                if client != ws:
                    try:
                        await client.send_text(
                            json.dumps({"user_id": user_id, "content": data})
                        )
                    except Exception:
                        to_remove.append(client)

            for dc in to_remove:
                clients[channel_id].remove(dc)

    except WebSocketDisconnect:
        if ws in clients[channel_id]:
            clients[channel_id].remove(ws)
    except Exception as e:
        if ws in clients[channel_id]:
            clients[channel_id].remove(ws)
        try:
            await ws.send_json({"error": str(e)})
            await ws.close(code=1011)
        except:
            pass
