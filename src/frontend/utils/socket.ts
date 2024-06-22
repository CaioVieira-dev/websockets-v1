import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
const URL = "http://localhost:3000";

type getSocketParams = {
  path: string;
};

export function getSocket({ path }: getSocketParams) {
  return io(URL, {
    autoConnect: false,
    path,
  });
}
