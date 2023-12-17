import { BrowserRouter } from "react-router-dom";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { AppNavigation } from "./app.navigation";
import { Loader } from "../modules";

export const App = () => (
  <>
    <Confirm.Component />
    <Loader />
    {/*  not move notifications to browser router, effector store initialize incorrectly */}
    <Notification.Component />
    <BrowserRouter>
      <AppNavigation />
    </BrowserRouter>
  </>
);
