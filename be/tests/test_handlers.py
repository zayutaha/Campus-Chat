import json

import pytest
from fastapi.testclient import TestClient

from handlers import app

client = TestClient(app)


def test_endpoints():
    r = client.post("/users", json={"name": "alice", "password": "123"})
    assert r.status_code == 200
    user_id = r.json()["user_id"]
    assert isinstance(user_id, int)

    r = client.post("/channels", params={"title": "general"})
    assert r.status_code == 200
    channel_id = r.json()["channel_id"]
    assert isinstance(channel_id, int)

    r = client.post(
        "/messages",
        params={
            "user_id": user_id,
            "channel_id": channel_id,
            "content": "Hello World!",
        },
    )
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

    r = client.get(f"/messages/{channel_id}")
    assert r.status_code == 200
    messages = r.json()
    assert isinstance(messages, list)
    assert messages[0]["user_id"] == user_id
    assert messages[0]["channel_id"] == channel_id
    assert messages[0]["content"] == "Hello World!"
