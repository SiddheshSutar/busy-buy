'use client'
import React from 'react'
import styles from './index.module.scss'
import Image from 'next/image';

const Navbar = () => {
    return (
        <div className={styles['main-nav']}>
            <Image
                src={'/images/image-gallery.png'}
                width={50}
                height={50}
                style={{
                    color: '#fff'
                }}
            />

        </div>
    );
}

export default Navbar;