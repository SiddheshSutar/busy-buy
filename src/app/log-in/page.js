'use client';
import { useParams } from "next/navigation";
import { AuthContextProvider } from "../../../authContext";
import { SnackbarContextProvider } from "../../../snackBarContext";
import LogIn from "../components/LogIn";

const LogInPage = () => {
    return <>
        <SnackbarContextProvider>
            <AuthContextProvider>
                <LogIn />
            </AuthContextProvider>
        </SnackbarContextProvider>
    </>
}

export default LogInPage;