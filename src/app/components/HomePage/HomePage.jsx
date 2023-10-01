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
                    <h3>Filters</h3>
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
                                                <div className={styles['title']} title={item.title}>
                                                    {
                                                        item.title.length > 36 ?
                                                        item.title.substring(0,36) + '...':
                                                        item.title
                                                    }
                                                </div>
                                                <button className={styles['button']} type='button' onClick={() => {}}>
                                                    Add to Cart                                                </button>
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