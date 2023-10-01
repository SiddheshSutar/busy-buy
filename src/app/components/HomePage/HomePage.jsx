'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../services';
import { useProductsValue } from '@/contexts/productsContext';
import styles from './index.module.scss'
import { Slider, Tooltip } from '@mui/material';


const HomePage = () => {

    const { products, productsAction, loading, maxCartValue } = useProductsValue()
    const [visibleProducts, setVisibleProducts] = useState(products)

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


    return (
        <>
            <div className={styles['container']}>
                <div className={styles['filters']}>
                    <h5>Filters</h5>
                    <Slider
                        size="small"
                        defaultValue={100}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        slots={{
                            valueLabel: ValueLabelComponent,
                          }}
                        onChange={e => {
                            setVisibleProducts(products.filter(item => {
                                return item.price <= ((e.target.value  * maxCartValue) / 100)
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