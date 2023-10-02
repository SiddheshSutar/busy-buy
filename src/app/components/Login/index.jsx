'use client'
import { Button, Grid, TextField } from '@mui/material';
import styles from './index.module.scss'
import { useState } from 'react';
import { addDoc, collection, getDocs, doc, query, where } from '@firebase/firestore';
import { USER_DB_NAME } from '../../../../constants';
import { db } from '../../../../fireStore';
import { useRouter } from 'next/navigation'
import { useSnackbarValue } from '@/contexts/snackBarContext';
import { setLogInInLocal } from '../../../../helpers';

const LogIn = () => {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const { toggle } = useSnackbarValue()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !password) {
            toggle({
                open: true,
                message: 'Validation error',
                severity: 'error'
            })
            return
        }

        const docRef = query(collection(db, USER_DB_NAME), where('name', '==', name), where('password', '==', password));
        const querySnapshot = await getDocs(docRef);
        let accounts = []
        querySnapshot.forEach((doc) => {
            accounts.push({
                [doc.id]: doc.data()
            })
            
        });

        if(accounts.length !== 1) {
            toggle({
                open: true,
                message: 'Account search error',
                severity: 'error'
            })
            return 
        }

        toggle({
            open: true,
            message: 'Logged In',
            severity: 'success'
        })
        setLogInInLocal(accounts[0].name)
        router.push('/');

    }

    return (
        <>
            <div className={styles['container']}>
                <h3>Log In</h3>
                <Grid container className={styles['form-container']} justifyContent={'center'}>
                    <Grid item lg={12}>
                        <TextField
                            placeholder='Name'
                            value={name}
                            name={"name"}
                            type='text'
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={12}>
                        <TextField
                            placeholder='Password'
                            value={password}
                            name='password'
                            type='password'
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={12}>

                        <Button variant="contained" type='button' color='primary' onClick={e => handleSubmit(e)}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default LogIn;