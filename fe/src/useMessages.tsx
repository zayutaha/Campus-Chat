import { useEffect, useState } from "react";
import { Message } from "./types";
import { BASE_URL } from "./module";

export const useMessages = ({
  channelId,
}: {
  channelId?: string;
}): Message[] => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!channelId) {
      return;
    }

    fetch(`${BASE_URL}/messages/${channelId}`)
      .then((res) => res.json())
      .then((messages) => setMessages(messages.map(convertFromServerMessage)))
      .catch(console.log);
  }, [channelId]);

  return messages;
};

export const convertFromServerMessage = (message: {
  user_id: number;
  user_name: string;
  content: string;
}) => {
  return {
    userId: message.user_id,
    userName: message.user_name,
    content: message.content,
  };
};
