'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../services';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'
import { Slider, Tooltip } from '@mui/material';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { useRouter } from 'next/navigation';
import { db } from '../../../../fireStore';
import { USER_DB_NAME } from '../../../../constants';
import { useUserValue } from '@/contexts/authContext';
import { doc, updateDoc } from 'firebase/firestore';
import { useSnackbarValue } from '@/contexts/snackBarContext';

const HomePage = () => {

    const { products, productsAction, loading, maxCartValue } = useProductsValue()
    const { signedInUser, userAction } = useUserValue()
    const { toggle } = useSnackbarValue()

    const [visibleProducts, setVisibleProducts] = useState(products)
    const [disabled, setDisabled] = useState(null)

    const router = useRouter()

    useEffect(() => {
        (
            async () => {
                productsAction('SET_LOADING', true)

                const productsArrRes = await fetchProducts('jewelery')
                productsAction('SET_LOADING', false)
                productsAction('SET_ALL', productsArrRes)
                setVisibleProducts(productsArrRes)
                console.log('dexx: ', productsArrRes)
            }
        )()

        /** Set user from localstorage */
        if(isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }
    }, [])


    function ValueLabelComponent(props) {
        const { children, value } = props;
        const val = (parseFloat(value) * maxCartValue) / 100

        return (
            <Tooltip enterTouchDelay={0} placement="top" title={val}>
                {children}
            </Tooltip>
        );
    }

    const handleAddToCart = async (productPassed, index) => {

        if (!isLoggedInViaCheckingLocal() || !signedInUser || !signedInUser.name) {
            router.push('/log-in')
            return
        }

        toggle({
            open: true,
            message: 'Loading',
            severity: 'info'
        })
        setDisabled(index)

        const editObj = { ...signedInUser }

        const editUserRef = doc(db, USER_DB_NAME, editObj.id);

        if (!editObj.cart) editObj.cart = []

        const newObj = {
            ...editObj,
            cart: [productPassed, ...editObj.cart]
        }
        const editres = await updateDoc(editUserRef, newObj);

        toggle({
            open: true,
            message: 'Updated the cart',
            severity: 'success'
        })
        setDisabled(null)


    }


    return (
        <>
            <div className={styles['container']}>
                <div className={styles['filters']}>
                    <h3>Filters</h3>
                    <Slider
                        size="small"
                        defaultValue={100}
                        aria-label="Small"
                        valueLabelDisplay="on"
                        slots={{
                            valueLabel: ValueLabelComponent,
                        }}
                        onChange={e => {
                            setVisibleProducts(products.filter(item => {
                                return item.price <= ((e.target.value * maxCartValue) / 100)
                            }))
                        }}
                    />
                </div>
                <div className={styles['products']}>
                    {
                        loading ?
                            <>
                                <h2>Loading...</h2>
                            </> :
                            <>
                                {
                                    visibleProducts.map((item, index) => (
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
                                                    disabled={index === disabled}
                                                >
                                                   {index === disabled ? 'Adding...' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                    }
                </div>
            </div>
        </>
    )
}

export default HomePage;