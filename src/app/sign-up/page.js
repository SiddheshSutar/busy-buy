'use client';
import { useParams } from "next/navigation";
import SignUp from "../components/SignUp";
import { SnackbarContextProvider } from "@/contexts/snackBarContext";
import { AuthContextProvider } from "@/contexts/authContext";

const SignUpPage = () => {
    const params = useParams()
    return <>
        <SnackbarContextProvider>
            <AuthContextProvider>
                <SignUp />
            </AuthContextProvider>
        </SnackbarContextProvider>
    </>
}

export default SignUpPage;