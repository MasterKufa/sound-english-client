import { TextField } from "@mui/material";

type NumericInputProps<T> = {
  label: string;
  field: T;
  value: string | number;
  onChange: (payload: {
    field: T;
    value: string | number;
    withConstraints?: boolean;
  }) => void;
  helperText?: string;
};

export const NumericInput = <T extends string>({
  label,
  field,
  value,
  onChange,
  helperText,
}: NumericInputProps<T>) => (
  <TextField
    label={label}
    variant="outlined"
    value={value}
    onBlur={({ target: { value } }) =>
      onChange({
        field,
        value,
        withConstraints: true,
      })
    }
    onChange={({ target: { value } }) => onChange({ field, value })}
    inputProps={{ type: "number" }}
    helperText={helperText}
  />
);
