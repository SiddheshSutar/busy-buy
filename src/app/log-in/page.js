'use client';
import { useParams } from "next/navigation";
import LogIn from "../components/LogIn";
import { SnackbarContextProvider } from "@/contexts/snackBarContext";
import { AuthContextProvider } from "@/contexts/authContext";

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