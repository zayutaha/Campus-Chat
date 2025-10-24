import random
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from channel.channels import Channel, ChannelRepo
from message.messages import Message, MessageRepo
from user.users import User, UserRepo


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

    def list(self) -> List[Channel]:
        return list(self.channel.values())

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
