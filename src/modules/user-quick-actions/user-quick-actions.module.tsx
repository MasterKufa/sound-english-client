import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { userModel } from "../../models";
import { Container, UserQuickInfo } from "./user-quick-actions.styles";

export const UserQuickActions = () => {
  const isUserDrawerOpened = useUnit(userModel.$isUserDrawerOpened);
  const currentUser = useUnit(userModel.$currentUser);
  const actions = useUnit({
    toggleUserDrawerOpened: userModel.toggleUserDrawerOpened,
    logout: userModel.logout,
  });

  return (
    <Box sx={Container}>
      <IconButton
        onClick={() => actions.toggleUserDrawerOpened(!isUserDrawerOpened)}
      >
        <AccountCircleOutlinedIcon />
      </IconButton>
      {currentUser && (
        <Drawer
          anchor="top"
          open={isUserDrawerOpened}
          onClose={() => actions.toggleUserDrawerOpened(false)}
        >
          <Box sx={UserQuickInfo}>
            <Typography variant="body2">User:&nbsp;</Typography>
            <Typography color="secondary.dark" variant="body2">
              {currentUser.login}
            </Typography>
          </Box>
          <Divider light />
          <Button variant="text" onClick={actions.logout}>
            Logout
          </Button>
        </Drawer>
      )}
    </Box>
  );
};
