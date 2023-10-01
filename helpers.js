import { LS_TOKEN_NAME } from "./constants";

export const isLoggedInViaCheckingLocal = () => Boolean(localStorage.getItem(LS_TOKEN_NAME))

export const setLogInInLocal = () => localStorage.setItem(LS_TOKEN_NAME, true)
 