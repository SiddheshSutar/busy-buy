'use client'
import React from 'react'
import styles from './index.module.scss'
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className={styles['main-nav']}>
            {/* <Image
                src={'/images/image-gallery.png'}
                width={50}
                height={50}
                style={{
                    color: '#fff'
                }}
            /> */}
            <p>
            Busy Buy
            </p>
            <div>
                {/* <a href="sign up" onClick={}> */}
                    Sign Up
                {/* </a> */}
            </div>
        </div>
    );
}

export default Navbar;