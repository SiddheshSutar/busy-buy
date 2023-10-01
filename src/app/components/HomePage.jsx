'use client'
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../services';


const HomePage = () => {

    useEffect(() => {
        (
            async () => {
                const x = await fetchProducts('jewelery')
                console.log('dexx: ', x)
            }
        )()
    }, [])


    return (
        <>
            <div className='body-wrapper'>
                Homepage
            </div>
        </>
    )
}

export default HomePage;