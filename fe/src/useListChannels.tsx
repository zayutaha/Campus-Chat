import { useEffect, useState } from "react";
import { Channel } from "./types";
import { BASE_URL } from "./module";

export const useListChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/channels`)
      .then((res) => res.json())
      .then((data) => setChannels(data.channels));
  }, []);

  return channels;
};
