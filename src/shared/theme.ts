import { Theme, ThemeOptions, createTheme } from "@mui/material";
import { cloneDeep, merge } from "lodash";

const DEFAULT_THEME_OPTIONS: ThemeOptions = {};
const DENSE_THEME_OPTIONS: ThemeOptions = merge(
  cloneDeep(DEFAULT_THEME_OPTIONS),
  {
    spacing: 4,
    components: {
      MuiButton: {
        defaultProps: {
          size: "small",
        },
      },
      MuiFilledInput: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFormControl: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFormHelperText: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: "small",
        },
      },
      MuiInputBase: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiInputLabel: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiListItem: {
        defaultProps: {
          dense: true,
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFab: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTable: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiToolbar: {
        defaultProps: {
          variant: "dense",
        },
      },
    },
  }
);

export const theme = createTheme(DEFAULT_THEME_OPTIONS);
export const denseTheme = createTheme(DENSE_THEME_OPTIONS);

export const currentTheme: { value: Theme | null } = {
  value: theme,
};

export const useCurrentTheme = (theme: Theme) => {
  currentTheme.value = theme;
};
