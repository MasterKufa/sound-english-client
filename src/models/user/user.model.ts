import { authTools, socket } from "@master_kufa/client-tools";
import { jwtDecode } from "jwt-decode";
import { createEffect, createEvent, createStore, sample } from "effector";
import { CurrentUser } from "../../shared/user.types";

export const $isUserDrawerOpened = createStore<boolean>(false);
export const $currentUser = createStore<CurrentUser | null>(null);

export const toggleUserDrawerOpened = createEvent<boolean>();
export const updateUserData = createEvent<CurrentUser>();
export const logout = createEvent();

sample({
  clock: toggleUserDrawerOpened,
  target: $isUserDrawerOpened,
});

sample({
  clock: updateUserData,
  target: $currentUser,
});

sample({
  clock: logout,
  target: createEffect(() => {
    authTools.clearAuthToken();
    socket.disconnect();
    toggleUserDrawerOpened(false);
  }),
});

const scanToken = () => {
  const token = authTools.getAuthToken();
  if (!token) return;

  updateUserData(jwtDecode(token));
};

window.addEventListener(authTools.SET_AUTH_TOKEN_EVENT, scanToken);
scanToken();
