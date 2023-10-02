'use client';
import { useParams } from "next/navigation";
import Cart from "../components/Cart";
import Provider from "@/contexts/provider";

const CartPage = () => {
    return <>
        <Provider>
            <Cart />
        </Provider>
    </>
}

export default CartPage;