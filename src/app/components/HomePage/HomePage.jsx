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
import { CoPresentOutlined } from '@mui/icons-material';

const HomePage = () => {

    const { products, productsAction, loading, maxCartValue, cart } = useProductsValue()
    const { signedInUser, userAction } = useUserValue()
    const { toggle } = useSnackbarValue()

    const [visibleProducts, setVisibleProducts] = useState(products)
    const [disabled, setDisabled] = useState(null)

    const router = useRouter()

    useEffect(() => {
        
        /** Set user from localstorage */
        if(isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }

    }, [])
    useEffect(() => {
        
        (
            async () => {
                if(signedInUser) {

                    productsAction('SET_LOADING', true)
                    
                    const productsArrRes = await fetchProducts('jewelery')
                    productsAction('SET_LOADING', false)
                    productsAction('SET_ALL', productsArrRes)
                    setVisibleProducts(productsArrRes)
                    
                    if(cart.length === 0) {
                        const x = await loadQuantityFromCart()
                    }
                }
            }
        )()

    }, [signedInUser])

    /** REFERENCE FOR DELET DOC  */
    useEffect(() => {
        
        deleteDoc(doc(db, CART_DB_NAME,  
            "eEY0tlFzIS35XsiiGKDv"))
        deleteDoc(doc(db, CART_DB_NAME,"wao3w3BOIe1Zq6D90m1V"))
        deleteDoc(doc(db, CART_DB_NAME,'yKm82FPDh8e9oScze2g8'))

          
    }, [])

    const loadQuantityFromCart = async () => {
        
        if(!signedInUser?.id) {
            // alert('user not there')
            return
        } 
        
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
                // id: doc.id,
                // {
                //     ...doc.data()
                // }
            })
            
        });
        const mappedList = cartDocs.map(item => ({
            id: Object.keys(item)[0],
            ...Object.values(item)[0]
        }))
        productsAction('SET_CART', mappedList)
        productsAction('SET_CART_ID', mappedList[0].id)
    console.log('hex: 1',mappedList )

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

        if(!cart) {
            toggle({
                open: true,
                // message: 'Some error occured while updating',
                message: 'emty cart',
                severity: 'error'
            })
            return
        }

        /**check User ka entry hai kya */
        let docKey = null
        const foundRecord = cart.find(item => signedInUser.id === item.forUser)

        if(
            cart && foundRecord
        ) {

            docKey = foundRecord.id
            const updateProductRef = doc(db, CART_DB_NAME, docKey);

            /**check Product ka entry hai kya */
            let isUpdated = false
            let updatedItems = [...foundRecord.items]
            
            updatedItems = updatedItems.map(itemObj => {
                if (itemObj.id === productPassed.id) {
                    isUpdated = true
                    return {
                        ...itemObj,
                        quantity : itemObj.quantity + 1
                    }
                } else return itemObj
            })

            if(!isUpdated) updatedItems = [{
                ...productPassed,
                quantity: 1
            }, ...updatedItems]

            // let newObj = {
            //     forUser: signedInUser.id,
            //     items: [...updatedItems]
            // }
            let newObj = {
                ...foundRecord,
                items: [...updatedItems]
            }

            
            
            const editres = await updateDoc(updateProductRef, newObj);
            const x = await loadQuantityFromCart()

        } else {
            const docRef = await addDoc(cartRef, {
                forUser: signedInUser.id,
                items: [
                    {
                        ...productPassed,
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