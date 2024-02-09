import { SxProps } from "@mui/material";

export const Container: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

export const ContainerButtons: SxProps = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 1,
};

export const OrderButton: SxProps = { minWidth: "80px" };

export const FilterNameButton: SxProps = { flexGrow: 1 };

export const FilterButton: SxProps = { width: "32px", height: "32px" };
