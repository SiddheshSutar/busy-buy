'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../services';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'
import { Checkbox, FormControlLabel, FormGroup, Input, Slider, Tooltip } from '@mui/material';
import { getLoggedInUserInLocal, isLoggedInViaCheckingLocal } from '../../../../helpers';
import { useRouter } from 'next/navigation';
import { db } from '../../../../fireStore';
import { CART_DB_NAME, ORDER_DB_NAME, USER_DB_NAME } from '../../../../constants';
import { useUserValue } from '@/contexts/authContext';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useSnackbarValue } from '@/contexts/snackBarContext';

const HomePage = () => {

    const { products, productsAction, loading, maxCartValue, cart } = useProductsValue()
    const { signedInUser, userAction } = useUserValue()
    const { toggle } = useSnackbarValue()

    const [searchText, setSearchText] = useState('')
    const [visibleProducts, setVisibleProducts] = useState(products)
    const [disabled, setDisabled] = useState(null)
    const [categories, setCategories] = useState([])

    const router = useRouter()

    useEffect(() => {

        /** Set user from localstorage */
        if (isLoggedInViaCheckingLocal()) {
            userAction('SET_USER', getLoggedInUserInLocal())
        }

    }, [])
    useEffect(() => {

        (
            async () => {
                if (signedInUser) {

                    /** Load products from API */
                    productsAction('SET_LOADING', true)

                    const productsArrRes = await fetchProducts()
                    productsAction('SET_LOADING', false)
                    productsAction('SET_ALL', productsArrRes)
                    setVisibleProducts(productsArrRes)

                    /** Compute categories of filters */
                    if (productsArrRes.length > 0) {
                        const categs = [...new Set(productsArrRes.map(item => item.category))]

                        if (categs && categs.length > 0) {

                            setCategories(categs.map(item => (
                                {
                                    label: item,
                                    selected: false
                                }
                            )))

                        }
                    }
                    
                    /** Load cart from DB */
                    if (cart.length === 0) {
                        const x = await loadQuantityFromCart()
                    }
                }
            }
        )()

    }, [signedInUser])

    /** REFERENCE FOR DELET DOC  */
    useEffect(() => {

        // deleteDoc(doc(db, CART_DB_NAME,"EYRppYhzPNPkV4D7egbC"))
        // deleteDoc(doc(db, CART_DB_NAME,'yKm82FPDh8e9oScze2g8'))

        // deleteDoc(doc(db, ORDER_DB_NAME,"12mYwq9PLGPrabYudcZc"))

        // (
        //     async () => {
        //         const updateProductRef = doc(db, CART_DB_NAME, 7);
        //         const editres = await updateDoc(updateProductRef, {
        //             id: 'eEY0tlFzIS35XsiiGKDv'
        //         });
        //     }
        // )()

    }, [])

    /** FIlter products via  */
    const handleSearchChange = e => {
        const newValue = e.target.value
        setSearchText(newValue)

        if (!newValue) {
            setVisibleProducts(products)
        } else {
            setVisibleProducts(visibleProducts.filter(prodc => {
                return prodc.title.toLowerCase().includes(newValue.toLowerCase()) || prodc.description.toLowerCase().includes(newValue.toLowerCase())
            }))

        }
    }

    const loadQuantityFromCart = async () => {

        if (!signedInUser.id) return

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
        productsAction('SET_CART', mappedList)
        productsAction('SET_CART_ID', mappedList[0]?.id)

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

        /**check User ka entry hai kya */
        let docKey = null
        const foundRecord = cart.find(item => signedInUser.id === item.forUser)


        if (
            foundRecord
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
                        quantity: itemObj.quantity + 1
                    }
                } else return itemObj
            })

            if (!isUpdated) updatedItems = [{
                ...productPassed,
                quantity: 1
            }, ...updatedItems]

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

    const handleCheckBox = (e, categorySelected, checkBoxIndex) => {

        const newCategs = categories.map((categoryItem, index) => {
            if (index === checkBoxIndex) return {
                ...categoryItem,
                selected: !categoryItem.selected
            }
            return categoryItem
        })

        setCategories(newCategs)


        let selectedCategs = newCategs.filter(itemP => itemP.selected).map(item => item.label)

        if (selectedCategs.length === 0) {
            setVisibleProducts(products)
        } else {
            const filteredProducts = products.filter(item => selectedCategs.includes(item.category))
            setVisibleProducts(filteredProducts)
        }

    }


    return (
        <>
            <div className={styles['container']}>
                <div className={styles['filters']}>
                    <h4>Search by text</h4>
                    <div className={styles['search-container']}>
                        <Input
                            className={styles['search']}
                            placeholder='Search'
                            value={searchText}
                            name='search'
                            type='search'
                            sx={{
                                '.MuiInputBase-input.MuiOutlinedInput-input': {
                                    padding: '10px'
                                }
                            }}
                            onChange={e => handleSearchChange(e)}
                        />
                    </div>
                    <div className={styles['filters-container']}>
                        <h4>Price Range</h4>
                        <div className={styles['slider']}>
                            <Slider
                                size="small"
                                min={0}
                                max={maxCartValue}
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
                    </div>
                    <div>
                        <h4>Search by category</h4>
                        {
                            categories.length > 0 &&
                            categories.map((categoryItem, indexC) => (
                                <div key={indexC}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox
                                            checked={categoryItem.selected}
                                            onChange={e => handleCheckBox(e, categoryItem, indexC)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />} label={categoryItem.label} />
                                    </FormGroup>
                                </div>
                            ))
                        }
                    </div>
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