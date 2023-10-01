'use client';
import { useParams } from "next/navigation";
import { AuthContextProvider } from "../../../authContext";
import { SnackbarContextProvider } from "../../../snackBarContext";
import SignUp from "../components/SignUp";

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