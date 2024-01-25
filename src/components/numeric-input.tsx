import { TextField } from "@mui/material";

type NumericInputProps<T> = {
  label: string;
  field: T;
  value: string | number;
  onChange: (payload: { field: T; value: string | number }) => void;
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
    name="numeric"
    label={label}
    variant="outlined"
    value={value}
    onBlur={({ target: { value } }) =>
      onChange({
        field,
        value,
      })
    }
    onChange={({ target: { value } }) => onChange({ field, value })}
    inputProps={{ type: "number" }}
    helperText={helperText}
  />
);
