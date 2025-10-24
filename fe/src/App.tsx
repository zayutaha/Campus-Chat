import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import CreateProfile from "./CreateProfile";
import { initializeSocket, sendMessage } from "./module";
import React from "react";
import Navbar from "./components/Navbar";
import { Messages } from "./components/Messages";
import { useLocalStorage } from "./useLocalStorage";
import { ChatBox } from "./components/ChatBox";
import { convertFromServerMessage, useMessages } from "./useMessages";
import { Message } from "./types";

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [session] = useLocalStorage();
  const initialMessages = useMessages({ channelId: session.currentChannel });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (session.currentChannel && session.userId) {
      const handleMessages = async (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        setMessages((messages) => [
          ...messages,
          convertFromServerMessage(message),
        ]);
      };

      const socket = initializeSocket(
        session.currentChannel,
        session.userId,
        handleMessages
      );
      setWebSocket(socket);

      return () => {
        socket?.close();
      };
    }
  }, [session]);

  const handleMessage = async (message: string) => {
    if (!session.userId || !webSocket) {
      return;
    }

    sendMessage(webSocket, message);
    setMessages((messages) => [
      ...messages,
      { content: message, userId: session.userId!, userName: session.userName },
    ]);
  };

  return (
    <Box className="flex justify-center w-full h-screen flex-col">
      <CreateProfile />
      <Navbar />
      <Messages messages={messages} />
      <Divider sx={{ mt: 2 }} />
      <ChatBox onMessage={handleMessage} />
    </Box>
  );
}
