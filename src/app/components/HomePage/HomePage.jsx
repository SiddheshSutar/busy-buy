'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../services';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'

const HomePage = () => {

    const { products, productsAction, loading } = useProductsValue()

    useEffect(() => {
        (
            async () => {
                productsAction('SET_LOADING', true)

                const productsArrRes = await fetchProducts('jewelery')
                productsAction('SET_LOADING', false)
                productsAction('SET_ALL', productsArrRes)

                console.log('dexx: ', productsArrRes)
            }
        )()
    }, [])


    return (
        <>
            <div className={styles['container']}>
                <div className={styles['filters']}>
                    <h5>Filters</h5>
                </div>
                <div className={styles['products']}>
                    {
                        loading ?
                            <>
                                <h2>Loading...</h2>
                            </> :
                            <>
                                {
                                    products.map((item, index) => (
                                            <div key={index} className={styles['product']}>
                                                <img 
                                                    src={item.image}
                                                    alt={'product-image'}
                                                    className={styles['image']}
                                                />
                                                <div className={styles['title']}>
                                                    {
                                                        item.title.length > 20 ?
                                                        item.title.substring(0,20) + '...':
                                                        item.title
                                                    }
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