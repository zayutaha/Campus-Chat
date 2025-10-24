import { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { Message } from "../types";

type MessagesProps = {
  messages: Message[];
};

export function Messages({ messages }: MessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return <NoMessages />;
  }

  return (
    <Box
      className="h-[80%] w-[100%] mt-[80px] flex items-center flex-col"
      sx={{ overflowY: "auto" }}
      ref={containerRef} // attach ref here
    >
      <div className="w-[90%] flex flex-col" style={{ gap: 30 }}>
        {messages.map((message, index) => {
          return (
            <Box className="flex" key={index}>
              <Paper sx={PaperStyle}>
                <Typography color="info">{message.userName}</Typography>
                <Typography sx={{ mt: 0.5 }}>{message.content}</Typography>
              </Paper>
            </Box>
          );
        })}
      </div>
    </Box>
  );
}

const NoMessages = () => (
  <Box className="h-[85%] flex justify-center items-center">
    <Typography color="textDisabled">No messages in this channel!</Typography>
  </Box>
);

const PaperStyle = {
  ml: 1,
  p: 2,
  borderBottomRightRadius: "10px",
  borderTopRightRadius: "10px",
  borderTopLeftRadius: "10px",
  borderBottomLeftRadius: "0px",
};
