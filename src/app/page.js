import { AuthContextProvider } from "../../authContext";
import HomePage from "./components/HomePage";
import Login from "./components/Login";

export default function Home() {
  return <>
  <AuthContextProvider>
    <Login />
    <HomePage />
  </AuthContextProvider>
  </>
}
