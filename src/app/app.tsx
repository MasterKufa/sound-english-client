import { BrowserRouter } from "react-router-dom";
import { Confirm, Notification } from "@master_kufa/client-tools";
import { AppNavigation } from "./app.navigation";
import { Loader } from "../modules";
import { ThemeProvider } from "@emotion/react";
import { denseTheme, theme, useCurrentTheme } from "shared/theme";
import { useMediaQuery } from "@mui/material";

export const App = () => {
  const isDense = useMediaQuery(theme.breakpoints.down("sm"));
  const currentTheme = isDense ? denseTheme : theme;

  useCurrentTheme(currentTheme);

  return (
    <ThemeProvider theme={currentTheme}>
      {/*  not move notifications to browser router, effector store initialize incorrectly, should be at top */}
      <Notification.Component />
      <Confirm.Component />
      <Loader />
      <BrowserRouter>
        <AppNavigation />
      </BrowserRouter>
    </ThemeProvider>
  );
};
