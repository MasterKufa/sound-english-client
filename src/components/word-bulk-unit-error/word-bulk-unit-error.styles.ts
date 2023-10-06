import { SxProps } from "@mui/material";

export const Container: SxProps = {
  display: "flex",
  gap: 1,
  alignItems: "center",
  height: 40,
};

export const WordContainer: SxProps = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr 2fr",
  alignItems: "center",
  flexGrow: 1,
  gap: 1,
};
