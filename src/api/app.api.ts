import { createEffect } from "effector";
import { socket } from "@master_kufa/client-tools";

export const connectSocketFx = createEffect(() =>
  socket.connect(
    `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`,
    `http://${process.env.REACT_APP_AUTH_HOST}/auth`
  )
);
