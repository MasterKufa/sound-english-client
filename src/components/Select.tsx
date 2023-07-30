import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as SelectMUI,
} from "@mui/material";

type SelectProps<T, V> = {
  label: string;
  field: T;
  value: V;
  onChange: (payload: { field: T; value: string }) => void;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
};

export const Select = <T extends string, V extends string | number>({
  label,
  field,
  value,
  onChange,
  helperText,
  options,
}: SelectProps<T, V>) => (
  <FormControl fullWidth>
    <InputLabel id={field}>{label}</InputLabel>
    <SelectMUI
      disabled={!value}
      labelId={field}
      label={label}
      value={value}
      onChange={({ target: { value } }) =>
        onChange({ field, value: value as T })
      }
    >
      {options.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </SelectMUI>
    <FormHelperText>{helperText}</FormHelperText>
  </FormControl>
);
