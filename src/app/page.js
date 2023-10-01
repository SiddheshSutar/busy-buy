import { AuthContextProvider } from "../../authContext";
import { SnackbarContextProvider } from "../../snackBarContext";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
// import Router from "./components/Router";
import CustomSnackbar from "./components/Snackbar";

export default function Home() {
  return <>
    <SnackbarContextProvider>
      <AuthContextProvider>
        {/* <Router /> */}
        {/* <SignUp /> */}
        <HomePage />
      </AuthContextProvider>
    </SnackbarContextProvider>
  </>
}
