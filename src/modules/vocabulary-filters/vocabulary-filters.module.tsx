import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useUnit } from "effector-react";
import { vocabularyFiltersModel } from "../../models/vocabulary";
import { VocabularyFilter } from "../../shared/vocabulary.types";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Container,
  ContainerButtons,
  FilterButton,
  FilterNameButton,
  OrderButton,
} from "./vocabulary-filters.styles";
import { LANG_LABELS } from "shared/constants";

const filterOptions = [
  {
    icon: <CalendarTodayIcon />,
    name: "By creation date",
    key: VocabularyFilter.creationDate,
  },
  {
    icon: <EditCalendarIcon />,
    name: "By modification date",
    key: VocabularyFilter.updateDate,
  },
  {
    icon: <AbcIcon />,
    name: "By alphabet (toggle to switch)",
    key: VocabularyFilter.alphabet,
  },
];

export const VocabularyFilters = () => {
  const filterText = useUnit(vocabularyFiltersModel.$filterText);
  const filter = useUnit(vocabularyFiltersModel.$filter);
  const order = useUnit(vocabularyFiltersModel.$order);
  const alphabetLang = useUnit(vocabularyFiltersModel.$alphabetLang);

  const actions = useUnit({
    applyFilter: vocabularyFiltersModel.applyFilter,
    filterTextChanged: vocabularyFiltersModel.filterTextChanged,
    toggleOrder: vocabularyFiltersModel.toggleOrder,
    toggleAlphabetLang: vocabularyFiltersModel.toggleAlphabetLang,
  });

  const currentFilterOption = filterOptions.find(({ key }) => key === filter);

  return (
    <Box sx={Container}>
      <TextField
        name="Search"
        fullWidth
        label="Search"
        value={filterText}
        onChange={({ target }) => actions.filterTextChanged(target.value)}
      />
      <Box sx={ContainerButtons}>
        {filterOptions.map((action) => (
          <Tooltip key={action.key} title={action.name}>
            <IconButton
              color={filter === action.key ? "primary" : "default"}
              sx={FilterButton}
              size="small"
              onClick={() => actions.applyFilter(action.key)}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}

        <Button
          sx={FilterNameButton}
          onClick={actions.toggleAlphabetLang}
          size="small"
          variant="text"
          disabled={filter !== VocabularyFilter.alphabet}
        >
          {filter === VocabularyFilter.alphabet
            ? `By ${LANG_LABELS[alphabetLang!]}`
            : currentFilterOption?.name}
        </Button>
        <Button
          sx={OrderButton}
          onClick={actions.toggleOrder}
          size="small"
          variant="text"
        >
          {order === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />} Order
        </Button>
      </Box>
    </Box>
  );
};
