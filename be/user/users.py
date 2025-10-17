from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class User:
    id: int | None
    name: str
    password: str


@dataclass
class UserBuilder:
    def __init__(self):
        self._id = None
        self._name = ""
        self._password = ""

    def with_name(self, name: str):
        self._name = name
        return self

    def with_password(self, password: str):
        self._password = password
        return self

    def build(self) -> User:
        return User(id=self._id, name=self._name, password=self._password)


class UserRepo(ABC):

    @abstractmethod
    def get(self, id: int) -> User:
        pass

    @abstractmethod
    def save(self, user: User) -> int:
        pass
