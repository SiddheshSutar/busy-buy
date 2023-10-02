'use client';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './index.module.scss'
import { CART_DB_NAME } from '../../../../constants';
import { db } from '../../../../fireStore';
import { useEffect } from 'react';
import { useUserValue } from '@/contexts/authContext';
import { useProductsValue } from '@/contexts/productsContext';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';

const Cart = () => {

    const { signedInUser, userAction } = useUserValue()
    const { products, productsAction, loading, maxCartValue, cart } = useProductsValue()

    const loadQuantityFromCart = async () => {

        if(!signedInUser?.id) return

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

        /** TO-DO : render UI correctly */
        console.log('hex ca: ', mappedList )

        if(mappedList[0].items) {
            productsAction('SET_CART', mappedList[0].items.map(item => item.product))
        }
    }

    useEffect(() => {
        (
            async () => {

                const x = await loadQuantityFromCart()
                
            }
            
        )()
    }, [signedInUser])

    useEffect(() => {

        if(isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }

    }, [])

    return (
        <>
            <div >
                <div></div>
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
                            <div className={styles['btn-row']}>
                                <div className={styles['price']}>{`₹ ${item.price}`}</div>
                                <button className={styles['button']} type='button'
                                    onClick={() => handleAddToCart(item, index)}
                                    // disabled={index === disabled}
                                >
                                    {
                                        // index === disabled ?
                                        false ?
                                            'Adding...' :
                                            item.quantity ? `+1` :
                                                'Add to Cart'
                                    }
                                </button>
                            </div>
                        </div>
                    ))

                }
                </div>
            </div>
        </>
    );
}

export default Cart;