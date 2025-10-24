import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import React, { useState } from "react";
import SelectChannel from "../selectChannel";
import { useListChannels } from "../useListChannels";
import { createChannel } from "../module";
import { Button, Modal, Paper, TextField } from "@mui/material";
import { useLocalStorage } from "../useLocalStorage";

export default function Navbar() {
  const [session, setSession] = useLocalStorage();
  const channels = useListChannels();
  const [channelName, setChannelName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (channel: number) => {
    setSession({ ...session, currentChannel: channel });
  };

  const handleSubmit = async () => {
    if (channelName.length <= 3) return;
    await createChannel(channelName);
    setOpen(false);
    setChannelName("");
  };

  return (
    <AppBar
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "row",
        gap: 1,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ChatIcon fontSize="large" />
        <Typography fontSize="20px">Campus Chat</Typography>
      </div>
      <div
        className="flex w-[50%]"
        style={{ justifyContent: "flex-end", gap: "20px" }}
      >
        <SelectChannel
          value={session.currentChannel}
          onChange={handleChange}
          channels={channels}
          style={{
            minWidth: "20%",
          }}
        />
        <Button onClick={() => setOpen(true)} variant="outlined">
          Create a new channel
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Paper
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: "300px",
            }}
          >
            <Typography textAlign="center" variant="h5">
              Create A New Channel
            </Typography>
            <TextField
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              fullWidth
              placeholder="Channel Name..."
            />
            <Button onClick={handleSubmit} variant="contained" fullWidth>
              Create
            </Button>
          </Paper>
        </Modal>
      </div>
    </AppBar>
  );
}
