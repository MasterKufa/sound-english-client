import { navigation } from "../shared/navigate";
import { Paths } from "./app.types";

export const buildTabsValue = () =>
  Object.values(Paths).find((path) =>
    navigation.location.pathname.includes(path)
  );
