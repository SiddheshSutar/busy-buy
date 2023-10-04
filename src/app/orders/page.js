'use client';
import { useParams } from "next/navigation";
import Orders from "../components/Orders";
import Provider from "@/contexts/provider";

const OrdersPage = () => {
    return <>
        <Provider>
            <Orders />
        </Provider>
    </>
}

export default OrdersPage;