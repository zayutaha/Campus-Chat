import axios from "axios";
export const BASE_URL = "http://localhost:8000";

export type Response<T> =
  | { status: "pending" }
  | { status: "success"; data: T }
  | {
      status: "error";
      error: string;
    };

export function initializeSocket(
  channelId: number,
  userId: number,
  handleEvent: (event: MessageEvent) => void,
): WebSocket {
  const ws = new WebSocket(
    `ws://localhost:8000/ws/channel/${channelId}/user/${userId}`,
  );

  ws.onopen = () => {
    console.log("WebSocket open");
  };
  ws.onerror = (e) => console.error("WebSocket error:", e);
  ws.onmessage = (e) => {
    handleEvent(e);
  };

  return ws;
}

export async function getUserName(userId: string) {
  const user = await axios
    .get(`${BASE_URL}/user?user_id=${userId}`)
    .then((res) => res.data);

  return user.name;
}
export async function sendMessage(webSocket: WebSocket, message: string) {
  if (!message.trim()) return;
  webSocket.send(message);
}

export async function createChannel(title: string): Promise<number> {
  return await fetch(`${BASE_URL}/channels`, {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => json.channel_id);
}
export async function createUser(
  username: string,
  password: string = "123",
): Promise<number> {
  return await fetch(`${BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify({
      name: username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => json.user_id);
}
