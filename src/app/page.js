import { SnackbarContextProvider } from "@/contexts/snackBarContext";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
// import Router from "./components/Router";
import CustomSnackbar from "./components/Snackbar";
import { AuthContextProvider } from "@/contexts/authContext";

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
