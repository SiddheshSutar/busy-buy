import { AuthContextProvider } from "../../authContext";
import { SnackbarContextProvider } from "../../snackBarContext";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import CustomSnackbar from "./components/Snackbar";

export default function Home() {
  return <>
    <SnackbarContextProvider>
      <AuthContextProvider>
        <Login />
        <HomePage />
      </AuthContextProvider>
    </SnackbarContextProvider>
  </>
}
