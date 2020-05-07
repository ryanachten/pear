export interface Peer {
  id: string;
  data: any;
}

export interface User {
  userName: string;
  connectionId: string;
}

export interface Signal {
  user: string;
  signal: any;
}
