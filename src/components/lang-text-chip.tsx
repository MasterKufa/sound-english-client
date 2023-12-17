import { Avatar, Chip } from "@mui/material";
import { Lang } from "../shared/settings.types";
import { EnFlagSrc, RuFlagSrc } from "../shared/icons";
import { LANG_LABELS } from "../shared/constants";

const LangToIconSrc: Record<Lang, string> = {
  [Lang.en]: EnFlagSrc,
  [Lang.ru]: RuFlagSrc,
};

export type LangTextChipProps = {
  text: string;
  lang: Lang;
};

export const LangTextChip = ({ text, lang }: LangTextChipProps) => (
  <Chip
    sx={{ justifyContent: "flex-start" }}
    avatar={<Avatar alt={LANG_LABELS[lang]} src={LangToIconSrc[lang]} />}
    label={text}
  />
);
