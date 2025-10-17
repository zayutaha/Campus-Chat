import pytest

from message.messages import MessageBuilder
from services import Server
from tests.in_memory_repo import (
    InMemoryChannelRepo,
    InMemoryMessageRepo,
    InMemoryUserRepo,
)
from user.users import UserBuilder


class TestMessaging:

    @pytest.fixture
    def server(self):
        return Server(InMemoryMessageRepo(), InMemoryUserRepo(), InMemoryChannelRepo())

    @pytest.fixture
    def setup_users_and_channel(self, server):
        alice = UserBuilder().with_name("Alice").with_password("secret").build()
        bob = UserBuilder().with_name("Bob").with_password("moresecret").build()
        alice_id = server.add_user(alice)
        bob_id = server.add_user(bob)
        channel_id = server.create_channel("General")
        return server, alice_id, bob_id, channel_id

    def test_message_persists_in_channel(self, setup_users_and_channel):
        server, alice_id, _, channel_id = setup_users_and_channel

        message = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(channel_id)
            .with_content("Hello, World!")
            .build()
        )

        messages = server.get_messages(channel_id)
        assert len(messages) == 0

        server.send_message(message)

        messages = server.get_messages(channel_id)
        assert len(messages) == 1
        assert messages[0].content == "Hello, World!"
        assert messages[0].user_id == alice_id

    def test_messages_are_ordered_chronologically(self, setup_users_and_channel):
        server, alice_id, bob_id, channel_id = setup_users_and_channel

        # Send messages at different times
        msg1 = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(channel_id)
            .with_content("First")
            .build()
        )
        msg2 = (
            MessageBuilder()
            .with_user_id(bob_id)
            .with_channel_id(channel_id)
            .with_content("Second")
            .build()
        )
        msg3 = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(channel_id)
            .with_content("Third")
            .build()
        )

        server.send_message(msg1)
        server.send_message(msg2)
        server.send_message(msg3)

        messages = server.get_messages(channel_id)
        assert [m.content for m in messages] == ["First", "Second", "Third"]

    def test_channels_are_isolated(self, setup_users_and_channel):
        server, alice_id, _, _ = setup_users_and_channel
        sports_channel = server.create_channel("Sports")
        tech_channel = server.create_channel("Tech")

        sports_msg = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(sports_channel)
            .with_content("Go team!")
            .build()
        )
        tech_msg = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(tech_channel)
            .with_content("Python rocks")
            .build()
        )

        server.send_message(sports_msg)
        server.send_message(tech_msg)

        assert len(server.get_messages(sports_channel)) == 1
        assert len(server.get_messages(tech_channel)) == 1
        assert server.get_messages(sports_channel)[0].content == "Go team!"
        assert server.get_messages(tech_channel)[0].content == "Python rocks"

    def test_empty_channel_returns_empty_list(self, setup_users_and_channel):
        server, _, _, _ = setup_users_and_channel
        channel_id = server.create_channel("Empty")
        messages = server.get_messages(channel_id)
        assert messages == []

    def test_cannot_send_message_to_nonexistent_channel(self, setup_users_and_channel):
        server, alice_id, _, _ = setup_users_and_channel
        invalid_id = 100
        message = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(invalid_id)
            .with_content("Hello")
            .build()
        )

        with pytest.raises(ValueError, match="Channel not found"):
            server.send_message(message)

    def test_cannot_send_message_from_nonexistent_user(self, setup_users_and_channel):
        server, _, _, channel_id = setup_users_and_channel
        invalid_id = 100
        message = (
            MessageBuilder()
            .with_user_id(invalid_id)
            .with_channel_id(channel_id)
            .with_content("Hello")
            .build()
        )

        with pytest.raises(ValueError, match="User not found"):
            server.send_message(message)

    def test_cannot_send_empty_message(self, setup_users_and_channel):
        server, alice_id, _, channel_id = setup_users_and_channel
        message = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(channel_id)
            .with_content("")
            .build()
        )

        with pytest.raises(ValueError, match="Message content cannot be empty"):
            server.send_message(message)

    def test_cannot_retrieve_messages_from_nonexistent_channel(
        self, setup_users_and_channel
    ):
        server, _, _, _ = setup_users_and_channel
        invalid_channel_id = 1000
        with pytest.raises(ValueError, match="Channel not found"):
            server.get_messages(invalid_channel_id)

    def test_multiple_messages_from_same_user_in_same_channel(
        self, setup_users_and_channel
    ):
        server, alice_id, _, channel_id = setup_users_and_channel

        for i in range(3):
            msg = (
                MessageBuilder()
                .with_user_id(alice_id)
                .with_channel_id(channel_id)
                .with_content(f"Message {i}")
                .build()
            )
            server.send_message(msg)

        messages = server.get_messages(channel_id)
        assert len(messages) == 3
        assert all(m.user_id == alice_id for m in messages)

    def test_cannot_send_whitespace_only_message(self, setup_users_and_channel):
        server, alice_id, _, channel_id = setup_users_and_channel
        message = (
            MessageBuilder()
            .with_user_id(alice_id)
            .with_channel_id(channel_id)
            .with_content("   ")
            .build()
        )

        with pytest.raises(ValueError, match="Message content cannot be empty"):
            server.send_message(message)
