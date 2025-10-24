import random
from dataclasses import dataclass, field
from typing import Dict, List, Optional

import pytest

from channel.channels import Channel, ChannelRepo
from message.messages import Message, MessageBuilder, MessageRepo
from services import Server
from user.users import User, UserBuilder, UserRepo


@dataclass
class InMemoryMessageRepo(MessageRepo):
    messages: Dict[int, List[Message]] = field(default_factory=dict)

    def get(self, channel_id: int) -> List[Message]:
        return self.messages.get(channel_id) or []

    def save(self, message: Message):
        if message.channel_id not in self.messages:
            self.messages[message.channel_id] = []
        self.messages[message.channel_id].append(message)


@dataclass
class InMemoryChannelRepo(ChannelRepo):
    channel: Dict[int, Channel] = field(default_factory=dict)

    def get(self, channel_id: int) -> Optional[Channel]:
        return self.channel.get(channel_id)

    def save(self, channel: Channel) -> int:
        if not channel.id:
            channel.id = int(random.randint(0, 255))

        self.channel[channel.id] = channel
        return channel.id


@dataclass
class InMemoryUserRepo(UserRepo):
    users: Dict[int, User] = field(default_factory=dict)

    def get(self, id: int) -> Optional[User]:
        return self.users.get(id)

    def save(self, user: User) -> int:
        if not user.id:
            user.id = int(random.randint(0, 255))

        self.users[user.id] = user

        return user.id


@pytest.mark.anyio(backends=["asyncio"])
async def test_message_should_persist_in_a_channel():
    server = Server(InMemoryMessageRepo(), InMemoryUserRepo(), InMemoryChannelRepo())

    user = UserBuilder().with_name("Bob").with_password("secret").build()

    user_id = server.add_user(user)
    channel_id = server.create_channel("General")
    message = (
        MessageBuilder()
        .with_user_id(user_id)
        .with_channel_id(channel_id)
        .with_content("Hello, World!")
        .build()
    )

    server.send_message(message)

    messages = server.get_messages(channel_id)

    assert [message] == messages


@pytest.mark.anyio(backends=["asyncio"])
async def test_multiple_users_can_send_messages_in_a_channel():
    server = Server(InMemoryMessageRepo(), InMemoryUserRepo(), InMemoryChannelRepo())

    user1 = UserBuilder().with_name("Alice").with_password("secret").build()
    user2 = UserBuilder().with_name("Bob").with_password("moresecret").build()

    user1_id = server.add_user(user1)
    user2_id = server.add_user(user2)
    channel_id = server.create_channel("Random")
    message1 = (
        MessageBuilder()
        .with_user_id(user1_id)
        .with_channel_id(channel_id)
        .with_content("Hello, World!")
        .build()
    )

    server.send_message(message1)

    message2 = (
        MessageBuilder()
        .with_user_id(user2_id)
        .with_channel_id(channel_id)
        .with_content("Hey! I'm Bob")
        .build()
    )
    server.send_message(message2)

    messages = server.get_messages(channel_id)

    assert [message1, message2] == messages


@pytest.mark.anyio(backends=["asyncio"])
async def test_multiple_users_chat_in_different_channels():
    server = Server(InMemoryMessageRepo(), InMemoryUserRepo(), InMemoryChannelRepo())

    user1 = UserBuilder().with_name("Alice").with_password("secret").build()
    user2 = UserBuilder().with_name("Bob").with_password("moresecret").build()

    user1_id = server.add_user(user1)
    user2_id = server.add_user(user2)
    channel1_id = server.create_channel("Sports")
    channel2_id = server.create_channel("Tech")
    message1 = (
        MessageBuilder()
        .with_user_id(user1_id)
        .with_channel_id(channel1_id)
        .with_content("Hello, World!")
        .build()
    )

    server.send_message(message1)

    message2 = (
        MessageBuilder()
        .with_user_id(user2_id)
        .with_channel_id(channel2_id)
        .with_content("Hey! I'm Bob")
        .build()
    )
    server.send_message(message2)

    messages = server.get_messages(channel1_id)

    assert messages == [message1]

    messages = server.get_messages(channel2_id)

    assert messages == [message2]
