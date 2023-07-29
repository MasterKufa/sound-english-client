import { Navigate, Route, Routes } from "react-router-dom";
import { navigation, useInitNavigation } from "../shared/navigate";
import { PLAYER_LABEL, Player, VOCABULARY_LABEL, Vocabulary } from "../pages";
import { Box, Paper, Stack, Tab, Tabs } from "@mui/material";
import { useGate } from "effector-react";
import { appModel } from "../models";
import { Container, NavigationContainer, TabContainer } from "./app.styles";
import { Paths } from "./app.types";

export const AppNavigation = () => {
  useInitNavigation();
  useGate(appModel.AppGate);

  return (
    <Stack sx={Container}>
      <Box sx={NavigationContainer}>
        <Tabs
          value={navigation.location.pathname}
          onChange={(_, value) => navigation.navigate(value)}
        >
          <Tab label={PLAYER_LABEL} value={Paths.player} />
          <Tab label={VOCABULARY_LABEL} value={Paths.vocabulary} />
          <Tab label="Settings" value={Paths.settings} />
        </Tabs>
        <Paper sx={TabContainer}>
          <Routes>
            <Route path="/">
              <Route element={<Navigate replace to={Paths.player} />} index />
              <Route path={Paths.root}>
                <Route element={<Navigate replace to={Paths.player} />} index />
                <Route path={Paths.player} element={<Player />} />
                <Route path={Paths.vocabulary} element={<Vocabulary />} />
              </Route>
            </Route>
          </Routes>
        </Paper>
      </Box>
    </Stack>
  );
};
