import { BrowserRouter } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { useUnit } from "effector-react";
import { Confirm, Notification, socket } from "@master_kufa/client-tools";
import { AppNavigation } from "./app.navigation";

export const App = () => {
  const isSocketConnected = useUnit(socket.$isConnected);

  return (
    <BrowserRouter>
      <AppNavigation />
      <Backdrop open={!isSocketConnected}>
        <CircularProgress />
      </Backdrop>
      <Notification.Component />
      <Confirm.Component />
    </BrowserRouter>
  );
};
