'use client'
import React from 'react'
import styles from './index.module.scss'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { isLoggedInViaCheckingLocal } from '../../../../helpers';

const Navbar = () => {

    const pathname = usePathname()

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
                <Link href="/">
                    Busy Buy
                </Link>
            </p>
            <div  className={styles['side-nav']}>
                {
                    isLoggedInViaCheckingLocal() &&
                    <>
                        <div>
                            <Link href="/cart">
                                Cart
                            </Link>
                        </div>
                        <div>
                            <Link href="/cart">
                                Orders
                            </Link>
                        </div>
                    </>
                }
                <div>
                    {
                        pathname.includes('sign-up') ?
                            <Link href="/log-in">
                                Log In
                            </Link> :
                            <Link href="/sign-up">
                                Sign Up
                            </Link>
                    }
                </div>
            </div>
        </div>
    );
}

export default Navbar;