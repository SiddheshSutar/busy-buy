'use client';
import { useParams } from "next/navigation";
import LogIn from "../components/LogIn";
import Provider from "@/contexts/provider";

const LogInPage = () => {
    return <>
        <Provider>
            <LogIn />
        </Provider>
    </>
}

export default LogInPage;