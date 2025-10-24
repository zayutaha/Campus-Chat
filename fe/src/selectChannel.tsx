import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from "@mui/material";
import { Channel } from "./types";
import React from "react";

type SelectChannelProps = {
  value?: number;
  channels: Channel[];
  onChange: (value: number) => void;
  style?: SxProps;
};

export default function SelectChannel({
  value,
  channels,
  onChange,
  style,
}: SelectChannelProps) {
  return (
    <FormControl sx={style}>
      <InputLabel>Channel</InputLabel>
      <Select
        value={value}
        label="Channel"
        onChange={(e) => onChange(e.target.value)}
        inputProps={{
          className: "text-start",
        }}
      >
        {channels?.map((channel: Channel) => (
          <MenuItem
            key={channel.id}
            value={channel.id}
            sx={{ textAlign: "center" }}
          >
            {channel.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
