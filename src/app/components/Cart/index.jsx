'use client';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import styles from './index.module.scss'
import { CART_DB_NAME } from '../../../../constants';
import { db } from '../../../../fireStore';
import { useEffect } from 'react';
import { useUserValue } from '@/contexts/authContext';
import { useProductsValue } from '@/contexts/productsContext';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { useSnackbarValue } from '@/contexts/snackBarContext';

const Cart = () => {

    const { signedInUser, userAction } = useUserValue()
    const { products, productsAction, loading, maxCartValue, cart, cartId } = useProductsValue()
    const { toggle } = useSnackbarValue()

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

        if (mappedList[0].items) {
            productsAction('SET_CART', mappedList[0].items.map(item => ({
                ...item
            })))
            productsAction('SET_CART_ID',  mappedList[0].id)
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

                if(cart.length === 0){
                    const x = await loadQuantityFromCart()
                }

            }

        )()
    }, [signedInUser])
    
    useEffect(() => {
    }, [cartId])

    const handleAction = async (productPassed, index, actionSign) => {

        if(!cartId) {
            toggle({
                open: true,
                message: 'No cart ID found to map',
                severity: 'error'
            })
            return
        }

        const newCart = cart.map(item => {
            if (item.id === productPassed.id) {
                return {
                    ...item,
                    quantity: actionSign === '+' ? item.quantity + 1 : item.quantity - 1
                }
            } else return item
        })
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

    return (
        <>
            <div >
                <h2>My Cart</h2>
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
                                <button className={styles['add-button']} type='button'
                                    onClick={() => handleAddToCart(item, index)}
                                // disabled={index === disabled}
                                >
                                    {
                                        // index === disabled ?
                                        false ?
                                            'Processing...' :
                                            'Order now'
                                    }
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