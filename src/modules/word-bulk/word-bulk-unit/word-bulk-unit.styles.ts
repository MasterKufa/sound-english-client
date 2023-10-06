import { SxProps } from "@mui/material";

export const Container: SxProps = {
  display: "flex",
  gap: 1,
  alignItems: "center",
  height: 50,
};

export const WordContainer: SxProps = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  flexGrow: 1,
  gap: 1,
};
