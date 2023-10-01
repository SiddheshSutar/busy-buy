import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
// import Router from "./components/Router";
import CustomSnackbar from "./components/Snackbar";
import Provider from "@/contexts/provider";

export default function Home() {
  return <>
    <Provider>
        {/* <Router /> */}
        {/* <SignUp /> */}
        <HomePage />
    </Provider>
  </>
}
