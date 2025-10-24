import random
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List


@dataclass
class Message:
    id: int | None
    user_id: int
    channel_id: int
    content: str


class MessageBuilder:
    def __init__(self):
        self._id = None
        self._user_id = None
        self._channel_id = None
        self._content = None

    def with_user_id(self, user_id: int):
        self._user_id = user_id
        return self

    def with_channel_id(self, channel_id: int):
        self._channel_id = channel_id
        return self

    def with_content(self, content: str):
        self._content = content
        return self

    def build(self) -> Message:
        id = random.randrange(1, 256)
        if self._user_id is None or self._channel_id is None or self._content is None:
            raise ValueError("All fields must be set before building a Message")
        return Message(id, self._user_id, self._channel_id, self._content)


class MessageRepo(ABC):

    @abstractmethod
    def get(self, id: int) -> List[Message]:
        pass

    @abstractmethod
    def save(self, message: Message):
        pass
