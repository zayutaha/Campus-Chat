export type UserSession = {
  userName: string;
  userId?: number;
  currentChannel?: number;
};

export type Channel = {
  id: number;
  title: string;
};

export type Message = {
  userId: number;
  userName: string;
  content: string;
};
