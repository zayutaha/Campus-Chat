import {
  AppBar,
  Avatar,
  Box,
  Button,
  Fab,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import JSONbig from "json-bigint";
export type Message = {
  userName: string;
  content: string;
};
export default function ChatApp() {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelId, setChannelId] = useState("");
  const [userId, setUserId] = useState("");
  const [webSocket, setWebSocket] = useState<any>();

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (channelId && !init) {
      console.log(channelId, init);
      setInit(true);
      fetch(`http://localhost:8081/messages/${channelId}`)
        .then((res) => res.text())
        .then((res) => JSONbig.parse(res))
        .then(async (data) => {
          const ms = await Promise.all(
            data.map(async (message) => ({
              userName: await getUserName(message.user_id),
              content: message.content,
            })),
          );
          console.log(ms);
          setMessages(ms);
        })
        .catch(console.error);
    }
  }, [channelId]);
  useEffect(() => {
    if (!channelId || !userId) return;
    const ws = new WebSocket(
      `ws://localhost:8081/ws/channel/${channelId}/user/${userId}`,
    );

    setWebSocket(ws);

    ws.onopen = () => console.log("WebSocket open");
    ws.onerror = (e) => console.error("WebSocket error:", e);
    ws.onmessage = async (event) => {
      const data = JSONbig.parse(JSON.parse(event.data).content);
      if (data.content) {
        const userName = await getUserName(data.user_id);
        setMessages((prev) => [...prev, { userName, content: data.content }]);
      }
    };

    // 🔥 cleanup
    return () => {
      ws.close();
      setWebSocket(undefined);
    };
  }, [channelId, userId]);
  const getUserName = async (userId: bigint) => {
    const user = await fetch(
      `http://localhost:8081/user?user_id=${userId}`,
    ).then((res) => res.json());

    return user.name;
  };

  useEffect(() => {
    if (!window.localStorage.getItem("channelId")) {
      fetch(`http://localhost:8081/channels?title=NewChannel`, {
        method: "POST",
      })
        .then((res) => res.text())
        .then((data) => {
          const id = data.slice(14, data.length - 1);
          setChannelId(id);
          window.localStorage.setItem("channelId", id);
        });
    } else {
      setChannelId(window.localStorage.getItem("channelId") as string);
    }
  }, [window]);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const sendMessage = (
    webSocket: WebSocket,
    username: string,
    message: string,
    shouldSend: boolean,
  ) => {
    if (!message.trim()) return;

    if (shouldSend) {
      webSocket.send(message);
    }

    setMessages((prev) => [
      ...prev,
      {
        userName: username,
        content: message,
      },
    ]);
    setMessage("");
  };
  const avatars = [
    { id: 1, src: "/profile_1.png" },
    { id: 2, src: "/profile_2.png" },
    { id: 3, src: "/profile_3.png" },
    { id: 4, src: "/profile_4.png" },
  ];

  const handleCreate = () => {
    if (!username || !selectedAvatar) return;
    fetch(`http://localhost:8081/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, password: "1234" }),
    })
      .then((res) => res.text())
      .then((data) => {
        const id = data.slice(11, data.length - 1);
        setUserId(id);
        window.localStorage.setItem("userId", id);
      });
    handleClose();
  };
  return (
    <Box className="flex justify-center w-full h-screen flex-col">
      <div>
        <Modal open={open}>
          <Box
            sx={{
              position: "absolute",
              outline: "none",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 360,
              bgcolor: "#121212",
              borderRadius: 3,
              boxShadow: "0 0 30px rgba(0,0,0,0.6)",
              p: 4,
              color: "#fff",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
            >
              Create Anonymous Profile
            </Typography>

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "#fff" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#333" },
                  "&:hover fieldset": { borderColor: "#555" },
                  "&.Mui-focused fieldset": { borderColor: "#888" },
                },
              }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Choose an Avatar
            </Typography>

            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              {avatars.map((avatar) => (
                <Grid item key={avatar.id}>
                  <Avatar
                    src={avatar.src}
                    alt={`Avatar ${avatar.id}`}
                    sx={{
                      width: 60,
                      height: 60,
                      border:
                        selectedAvatar === avatar.id
                          ? "2px solid #18c45a"
                          : "2px solid transparent",
                      transition: "0.2s",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#00bcd4",
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  />
                </Grid>
              ))}
            </Grid>

            <Button
              fullWidth
              variant="contained"
              onClick={handleCreate}
              disabled={!username || !selectedAvatar}
              sx={{
                bgcolor: "#00bcd4",
                color: "white",
                fontWeight: 500,
                fontSize: "16px",
                textTransform: "none",
                borderRadius: 2,
                py: 1,
                "&:hover": { bgcolor: "#00acc1" },
                "&:disabled": { bgcolor: "#333", color: "#777" },
              }}
            >
              Create Profile
            </Button>
          </Box>
        </Modal>{" "}
      </div>
      <AppBar
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <ChatIcon />
        <Typography>Chat App</Typography>
      </AppBar>
      <Box className="h-[80%] w-[100%] mt-[80px] flex items-center flex-col">
        <div className="w-[90%] flex flex-col" style={{ gap: 30 }}>
          {messages.map((message, index) => (
            <Box className="flex" key={index}>
              <Avatar />
              <Paper
                sx={{
                  ml: 1,
                  p: 2,
                  borderBottomRightRadius: "10px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "0px",
                }}
              >
                <Typography>{message.userName}</Typography>
                <Typography>{message.content}</Typography>
              </Paper>
            </Box>
          ))}
        </div>
      </Box>

      <Box className="w-full flex justify-center">
        <Box className="mt-5 w-[90%] flex flex-row justify-between">
          <TextField
            placeholder="Send a message!"
            className="w-[95%]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Fab
            type="submit"
            onClick={() => sendMessage(webSocket, username, message, true)}
          >
            <SendIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  );
}

//<Box className="h-[80%] flex justify-center items-center">
//        <Typography color="textDisabled">Chat here to see messages!</Typography>
//      </Box>
