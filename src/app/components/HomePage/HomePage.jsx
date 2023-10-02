'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../services';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'
import { Slider, Tooltip } from '@mui/material';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { useRouter } from 'next/navigation';
import { db } from '../../../../fireStore';
import { CART_DB_NAME, USER_DB_NAME } from '../../../../constants';
import { useUserValue } from '@/contexts/authContext';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useSnackbarValue } from '@/contexts/snackBarContext';

const HomePage = () => {

    const { products, productsAction, loading, maxCartValue } = useProductsValue()
    const { signedInUser, userAction } = useUserValue()
    const { toggle } = useSnackbarValue()

    const [visibleProducts, setVisibleProducts] = useState(products)
    const [disabled, setDisabled] = useState(null)
    const [cartDbList, setCartDbList] = useState(null)
    const [cartQuantities, setCartQuantities] = useState(null)

    const router = useRouter()

    useEffect(() => {
        (
            async () => {
                productsAction('SET_LOADING', true)

                const productsArrRes = await fetchProducts('jewelery')
                productsAction('SET_LOADING', false)
                productsAction('SET_ALL', productsArrRes)
                setVisibleProducts(productsArrRes)

                const x = await loadQuantityFromCart()
            }
        )()

        /** Set user from localstorage */
        if(isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }

    }, [])

    /** REFERENCE FOR DELET DOC  */
    useEffect(() => {
        
        // deleteDoc(doc(db, CART_DB_NAME, "7bjX7USDILqLrjois8gm"))
        // deleteDoc(doc(db, CART_DB_NAME, "AxbL2BxDVGpxcllEipFh"))
        // deleteDoc(doc(db, CART_DB_NAME, "Mgsr1Q35nZXPvLKNOCCs"))

          
    }, [])

    const loadQuantityFromCart = async () => {
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
        setCartDbList(mappedList)
    }


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

        const cartRef = collection(db, CART_DB_NAME);

        if(!cartDbList) {
            toggle({
                open: true,
                // message: 'Some error occured while updating',
                message: 'emty cartDbList',
                severity: 'error'
            })
            return
        }

        /**check User ka entry hai kya */
        let docKey = null
        const foundRecord = cartDbList.find(item => signedInUser.id === item.forUser)

        if(
            cartDbList && foundRecord
        ) {

            docKey = foundRecord.id
            const updateProductRef = doc(db, CART_DB_NAME, docKey);

            /**check Product ka entry hai kya */
            let isUpdated = false
            let updatedItems = [...foundRecord.items]
            
            updatedItems = updatedItems.map(itemObj => {
                if (itemObj.product.id === productPassed.id) {
                    isUpdated = true
                    return {
                        ...itemObj,
                        quantity : itemObj.quantity + 1
                    }
                } else return itemObj
            })

            if(!isUpdated) updatedItems = [{
                product: productPassed,
                quantity: 1
            }, ...updatedItems]

            let newObj = {
                forUser: signedInUser.id,
                items: [...updatedItems]
            }
            
            const editres = await updateDoc(updateProductRef, newObj);
            const x = await loadQuantityFromCart()

        } else {
            const docRef = await addDoc(cartRef, {
                forUser: signedInUser.id,
                items: [
                    {
                        product: productPassed,
                        quantity: 1
                    }
                ]
            });
            const x = await loadQuantityFromCart()

        }

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
                                                    {
                                                        index === disabled ?
                                                            'Adding...' :
                                                            item.quantity ? `+1` :
                                                                'Add to Cart'
                                                    }
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