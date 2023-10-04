'use client'
import { useEffect } from 'react';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'
import { useUserValue } from '@/contexts/authContext';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../fireStore';
import { ORDER_DB_NAME } from '../../../../constants';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Table } from 'antd';

const Orders = () => {

    const { signedInUser, userAction } = useUserValue()
    const { products, productsAction, loading, maxCartValue, cart, cartId, orders } = useProductsValue()
    console.log('hex o: ', orders)

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
{/*                 
                {
                    orders?.length > 0 &&
                    <div>
                        {
                            orders.map(item => (<>
                            <div>{JSON.stringify(item)}</div></>))
                        }
                    </div>
                } */}
                {
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                    
                                {orders?.length > 0 && orders.map((row) => (
                                    <TableRow
                                        key={row.title}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="right">{row.quantity}</TableCell>
                                        <TableCell align="right">{row.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </div>
        </div>
    );
}

export default Orders;
