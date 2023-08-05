import { Navigate, Route, Routes } from "react-router-dom";
import { navigation, useInitNavigation } from "../shared/navigate";
import {
  PLAYER_LABEL,
  Player,
  Settings,
  VOCABULARY_LABEL,
  Vocabulary,
  SETTINGS_LABEL,
} from "../pages";
import { Box, Paper, Stack, Tab, Tabs } from "@mui/material";
import { useGate } from "effector-react";
import { appModel } from "../models";
import { Container, NavigationContainer, TabContainer } from "./app.styles";
import { Paths } from "./app.types";
import { Word } from "../pages/word";
import { buildTabsValue } from "./app.helpers";

export const AppNavigation = () => {
  useInitNavigation();
  useGate(appModel.AppGate);

  return (
    <Stack sx={Container}>
      <Box sx={NavigationContainer}>
        <Tabs
          value={buildTabsValue()}
          onChange={(_, value) => navigation.navigate(value)}
        >
          <Tab label={PLAYER_LABEL} value={Paths.player} />
          <Tab label={VOCABULARY_LABEL} value={Paths.vocabulary} />
          <Tab label={SETTINGS_LABEL} value={Paths.settings} />
        </Tabs>
        <Paper sx={TabContainer}>
          <Routes>
            <Route path="/">
              <Route element={<Navigate replace to={Paths.player} />} index />
              <Route path={Paths.root}>
                <Route element={<Navigate replace to={Paths.player} />} index />
                <Route path={Paths.player} element={<Player />} />
                <Route path={Paths.vocabulary} element={<Vocabulary />} />
                <Route path={Paths.word} element={<Word />} />
                <Route path={Paths.settings} element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Paper>
      </Box>
    </Stack>
  );
};
