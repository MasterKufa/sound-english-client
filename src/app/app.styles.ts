import { SxProps } from "@mui/material";
import { adjustAppHeight } from "@master_kufa/client-tools";

export const Container: SxProps = {
  height: adjustAppHeight(),
  bgcolor: "grey.300",
  display: "flex",
  alignItems: "center",
};

export const NavigationContainer: SxProps = {
  height: "100%",
};

export const TabContainer: SxProps = {
  padding: 3,
  width: "95vw",
  maxWidth: "500px",
  maxHeight: "calc(100% - 60px)",
  overflow: "auto",
};
