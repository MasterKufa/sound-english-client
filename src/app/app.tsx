import { BrowserRouter } from "react-router-dom";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { AppNavigation } from "./app.navigation";
import { Loader } from "../modules";

export const App = () => (
  <BrowserRouter>
    <AppNavigation />
    <Loader />
    <Notification.Component />
    <Confirm.Component />
  </BrowserRouter>
);
