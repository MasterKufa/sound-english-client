import { LANG_LABELS } from "../../shared/constants";

export const SETTINGS_LABEL = "Settings";

export const LANG_OPTIONS = Object.entries(LANG_LABELS).map(
  ([value, label]) => ({ value, label })
);
