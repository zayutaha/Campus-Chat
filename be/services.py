from dataclasses import dataclass
from typing import List, Optional

from channel.channels import Channel, ChannelBuilder, ChannelRepo
from message.messages import Message, MessageRepo
from user.users import User, UserRepo


@dataclass
class Server:
    message_repo: MessageRepo
    user_repo: UserRepo
    channel_repo: ChannelRepo

    def add_user(self, user: User) -> int:
        return self.user_repo.save(user)

    def create_channel(self, title: str) -> int:
        channel = ChannelBuilder().with_title(title).build()
        return self.channel_repo.save(channel)

    def get_channel(self, channel_id: int) -> Optional[Channel]:
        channel = self.channel_repo.get(channel_id)
        return channel

    def get_user(self, user_id: int) -> Optional[User]:
        user = self.user_repo.get(user_id)
        return user

    def get_messages(self, channel_id: int) -> List[Message]:
        if self.channel_repo.get(channel_id) is not None:
            return self.message_repo.get(channel_id)
        else:
            raise ValueError("Channel not found")

    def send_message(self, message: Message):
        if self.channel_repo.get(message.channel_id) is not None:
            self.message_repo.save(message)
        else:
            raise ValueError("Channel not found")

        if self.user_repo.get(message.user_id) is None:
            raise ValueError("User not found")

        if message.content.strip() == "":
            raise ValueError("Message content cannot be empty")
