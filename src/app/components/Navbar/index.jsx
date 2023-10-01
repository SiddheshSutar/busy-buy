'use client'
import React from 'react'
import styles from './index.module.scss'
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

const Navbar = () => {

    // const params = useParams()
    const pathname = usePathname()


    console.log('hex: ', pathname)
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
    );
}

export default Navbar;