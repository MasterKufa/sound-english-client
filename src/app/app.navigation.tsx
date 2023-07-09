import { Route, Routes } from "react-router-dom";
import { Paths } from "../shared/types";
import { navigation, useInitNavigation } from "../shared/navigate";
import { VOCABULARY_LABEL, Vocabulary } from "../pages";
import { Box, Paper, Stack, Tab, Tabs } from "@mui/material";
import { useGate } from "effector-react";
import { appModel } from "../models";
import { Container, TabContainer } from "./styles";

export const AppNavigation = () => {
  useInitNavigation();
  useGate(appModel.AppGate);

  return (
    <Stack sx={Container}>
      <Box>
        <Tabs
          value={navigation.location.pathname}
          onChange={(_, value) => navigation.navigate(value)}
        >
          <Tab label={VOCABULARY_LABEL} value={Paths.vocabulary} />
          <Tab label="Settings" value={Paths.settings} />
        </Tabs>
        <Paper sx={TabContainer}>
          <Routes>
            <Route path={Paths.vocabulary} element={<Vocabulary />} />
          </Routes>
        </Paper>
      </Box>
    </Stack>
  );
};
