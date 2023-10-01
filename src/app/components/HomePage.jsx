'use client'
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';



const HomePage = () => {

    useEffect(() => {
        fetchProducts('jewelery')
    }, [])
    

    return (
        <>
          {/* <Navbar /> */}
            <div className='body-wrapper'>
                Homepage
            </div>
        </>
    )
}

export default HomePage;