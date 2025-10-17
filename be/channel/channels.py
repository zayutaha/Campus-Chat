from abc import ABC, abstractmethod
from typing import List, Optional


class Channel:
    id: int | None
    title: str


class ChannelBuilder:
    def __init__(self):
        self._id = None
        self._title = None

    def with_title(self, title: str):
        self._title = title
        return self

    def build(self) -> Channel:
        channel = Channel()
        channel.id = self._id
        if self._title is None:
            raise ValueError("Title is required")
        channel.title = self._title
        return channel


class ChannelRepo(ABC):

    @abstractmethod
    def get(self, id: int) -> Optional[Channel]:
        pass

    @abstractmethod
    def save(self, message: Channel) -> int:
        pass
