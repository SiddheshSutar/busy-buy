'use client'
import { useEffect } from 'react';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'
import { useUserValue } from '@/contexts/authContext';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../fireStore';
import { ORDER_DB_NAME } from '../../../../constants';

const Orders = () => {

    const { signedInUser, userAction } = useUserValue()
    const { products, productsAction, loading, maxCartValue, cart, cartId, orders } = useProductsValue()

    useEffect(() => {

        if (isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }

    }, [])

    useEffect(() => {
        (
            async () => {

                if (orders.length === 0) {
                    const x = await loadQuantityFromOrders()
                }

            }

        )()
    }, [signedInUser])

    const loadQuantityFromOrders = async () => {

        if (!signedInUser?.id) return

        /** fetch cart */
        const exisOrderRef = query(
            collection(db, ORDER_DB_NAME),
            where('forUser', '==', signedInUser.id),
        );
        const querySnapshot = await getDocs(exisOrderRef);
        let orderDocs = []
        querySnapshot.forEach((doc) => {
            orderDocs.push({
                [doc.id]: doc.data()
            })

        });
        const mappedList = orderDocs.map(item => ({
            id: Object.keys(item)[0],
            ...Object.values(item)[0]
        }))

        if (mappedList[0].items) {
            productsAction('SET_ORDERS', mappedList[0].items.map(item => ({
                ...item
            })))
            productsAction('SET_ORDER_ID', mappedList[0].id)
        }
    }

    return (
        <div className={styles['orders-container']}>
            <h3>My orders</h3>
            <div>
                {
                    !orders || orders.length === 0 &&
                    <p>No orders found yet..</p>
                }
                {
                    orders?.length > 0 &&
                    <>
                        <table cellspacing="0" cellpadding="0" className={styles['order-table']} border={0}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map((orderObj, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img
                                                    src={orderObj.image}
                                                    alt={orderObj.title}
                                                />
                                            </td>
                                            <td>
                                                {orderObj.title}
                                            </td>
                                            <td>
                                                {orderObj.quantity}
                                            </td>
                                            <td>
                                                {orderObj.price}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                }
            </div>
        </div>
    );
}

export default Orders;
