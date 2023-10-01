'use client';
import { useParams } from "next/navigation";
import { AuthContextProvider } from "../../contexts/authContext";
import { SnackbarContextProvider } from "../../../snackBarContext";
import SignUp from "../components/SignUp";

const SignUpPage = () => {
    const params = useParams()

    console.log('hex: ', params)
    return <>
        <SnackbarContextProvider>
            <AuthContextProvider>
                <SignUp />
            </AuthContextProvider>
        </SnackbarContextProvider>
    </>
}

export default SignUpPage;