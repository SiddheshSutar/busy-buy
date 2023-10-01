'use client';
import { useParams } from "next/navigation";
import SignUp from "../components/SignUp";
import Provider from "@/contexts/provider";

const SignUpPage = () => {
    const params = useParams()
    return <>
        <Provider>
            <SignUp />
        </Provider>
    </>
}

export default SignUpPage;