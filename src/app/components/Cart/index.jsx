'use client';
import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import styles from './index.module.scss'
import { CART_DB_NAME, ORDER_DB_NAME } from '../../../../constants';
import { db } from '../../../../fireStore';
import { useEffect } from 'react';
import { useUserValue } from '@/contexts/authContext';
import { useProductsValue } from '@/contexts/productsContext';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { useSnackbarValue } from '@/contexts/snackBarContext';

const Cart = () => {

    const { signedInUser, userAction } = useUserValue()
    const { products, productsAction, loading, maxCartValue, cart, cartId, orders } = useProductsValue()
    const { toggle } = useSnackbarValue()
    const [disabled, setDisabled] = useState(null)

    const loadQuantityFromCart = async () => {

        if (!signedInUser?.id) return

        /** fetch cart */
        const exisCartref = query(
            collection(db, CART_DB_NAME),
            where('forUser', '==', signedInUser.id),
        );
        const querySnapshot = await getDocs(exisCartref);
        let cartDocs = []
        querySnapshot.forEach((doc) => {
            cartDocs.push({
                [doc.id]: doc.data()
            })

        });

        const mappedList = cartDocs.map(item => ({
            id: Object.keys(item)[0],
            ...Object.values(item)[0]
        }))

        if (mappedList?.[0]?.items) {
            productsAction('SET_CART', mappedList[0].items.map(item => ({
                ...item
            })))
        }
        if (mappedList?.[0]?.id) {
            productsAction('SET_CART_ID', mappedList[0].id)
        }
    }

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

        if (mappedList?.[0]?.items) {
            productsAction('SET_ORDERS', mappedList[0].items.map(item => ({
                ...item
            })))
            productsAction('SET_ORDER_ID', mappedList[0].id)
        }
    }



    useEffect(() => {

        if (isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }

    }, [])

    useEffect(() => {
        (
            async () => {

                if (cart.length === 0) {
                    const x = await loadQuantityFromCart()
                }
                if (orders.length === 0) {
                    const x = await loadQuantityFromOrders()
                }

            }

        )()
    }, [signedInUser])

    useEffect(() => {
    }, [cart])

    const handleAction = async (productPassed, index, actionSign) => {

        if (!cartId) {
            toggle({
                open: true,
                message: 'No cart ID found to map',
                severity: 'error'
            })
            return
        }

        if (actionSign === '-' && productPassed.quantity === 0) {
            return
        }

        if (actionSign === '+' && productPassed.quantity + 1 > 4) {
            toggle({
                open: true,
                message: 'Max order limit reached : 4',
                severity: 'error'
            })
            return
        }

        let newCart = [...cart]

        if (actionSign === '-' && productPassed.quantity === 1) {
            newCart = cart.filter(item => item.id !== productPassed.id)
        } else {
            newCart = cart.map(item => {
                if (item.id === productPassed.id) {
                    return {
                        ...item,
                        quantity: actionSign === '+' ? item.quantity + 1 : item.quantity - 1
                    }
                } else return item
            })
        }


        productsAction('SET_CART', newCart)

        const updateProductRef = doc(db, CART_DB_NAME, cartId);
        const editres = await updateDoc(updateProductRef, {
            items: newCart
        });
        const x = await loadQuantityFromCart()

        toggle({
            open: true,
            message: 'Cart Updated',
            severity: 'success'
        })
    }

    const removeProductFromCart = async (productPassed, removeAll) => {

        if (!cart || cart.length === 0) {
            toggle({
                open: true,
                message: 'removeProductFromCart: Empty cart',
                severity: 'error'
            })
            return
        }
        if (!signedInUser) {
            toggle({
                open: true,
                message: 'removeProductFromCart: User not found',
                severity: 'error'
            })
            return
        }

        if (
            !cartId
        ) {
            toggle({
                open: true,
                message: 'removeProductFromCart: Cart record to be deleted not found',
                severity: 'error'
            })
            return
        }

        const updateProductRef = doc(db, CART_DB_NAME, cartId);

        if (
            removeAll && !productPassed
        ) {
            //  deleteDoc(doc(db, CART_DB_NAME,cartId))
            let newObj = {
                forUser: signedInUser.id,
                items: []
            }
    
            const editres = await updateDoc(updateProductRef, newObj);
            const x = await loadQuantityFromCart()
            const y = await loadQuantityFromOrders()

            return
        }


        /**check Product ka entry hai kya */
        let updatedItems = [...cart]

        /** remove deleted item from cart items array */
        updatedItems = updatedItems.filter(itemObj => itemObj.id !== productPassed.id)

        let newObj = {
            forUser: signedInUser.id,
            items: [...updatedItems]
        }


        const editres = await updateDoc(updateProductRef, newObj);
        const x = await loadQuantityFromCart()
        const y = await loadQuantityFromOrders()


    }

    const handleOrderNow = async () => {

        if (!isLoggedInViaCheckingLocal() || !signedInUser || !signedInUser.name) {
            toggle({
                open: true,
                message: 'No cart ID found to map',
                severity: 'error'
            })
            return
        }
        if (!cart || cart.length=== 0) {
            toggle({
                open: true,
                message: 'Cart is empty',
                severity: 'error'
            })
            return
        }

        toggle({
            open: true,
            message: 'Loading',
            severity: 'info'
        })
        setDisabled(true)

        const orderRef = collection(db, ORDER_DB_NAME);


        const docRef = await addDoc(orderRef, {
            createdAt: (new Date()).toISOString(),
            forUser: signedInUser.id,
            items: [...cart]
            // items: [
            //     {
            //         ...productPassed,
            //     }
            // ]
        });


        await removeProductFromCart(null, true)

        toggle({
            open: true,
            message: 'Order successful!',
            severity: 'success'
        })
        setDisabled(false)
        router.push('/orders')


    }

    const handleRemove = async (cartItemToBeRemoved, index) => {

        setDisabled(true)

        await removeProductFromCart(cartItemToBeRemoved)
        toggle({
            open: true,
            message: 'Item removed',
            severity: 'success'
        })
        setDisabled(null)

    }

    return (
        <>
            <div >
                <div className={styles['title-row']}>
                    <div className={styles['title-col']}>
                        <h2>My Cart</h2>
                    </div>
                    <div className={styles['title-col']}>
                        <button className={styles['action-button']} type='button'
                            onClick={() => handleOrderNow()}
                        >
                            {
                                // index === disabled ?
                                false ?
                                    'Processing...' :
                                    'Order now'
                            }
                        </button>
                    </div>
                </div>
                <div className={styles['products']}>
                    {
                        cart.map((item, index) => (
                            <div key={index} className={styles['product']}>
                                <img
                                    src={item.image}
                                    alt={'product-image'}
                                    className={styles['image']}
                                />
                                <div className={styles['title']} title={item.title}>
                                    {
                                        item.title.length > 36 ?
                                            item.title.substring(0, 36) + '...' :
                                            item.title
                                    }
                                </div>
                                <div className={styles['cost-row']}>
                                    <div className={styles['quantity-row']}>
                                        <button className={styles['action-button']} type='button'
                                            onClick={() => handleAction(item, index, '+')}
                                        >
                                            +
                                        </button>
                                        <div className={styles['quantity']}>{item.quantity}</div>
                                        <button className={styles['action-button']} type='button'
                                            onClick={() => handleAction(item, index, '-')}
                                        >
                                            -
                                        </button>
                                    </div>
                                    <div className={styles['price']}>{`₹ ${item.price * item.quantity}`}</div>
                                </div>
                                <button className={styles['action-button']} type='button'
                                    onClick={() => handleRemove(item, index)}
                                >
                                    Remove From Cart
                                </button>
                            </div>
                        ))

                    }
                </div>
            </div>
        </>
    );
}

export default Cart;