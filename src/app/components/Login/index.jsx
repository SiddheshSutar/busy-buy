'use client'
import { Button, Container, Grid, TextField } from '@mui/material';
import styles from './index.module.scss'
import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from '@firebase/firestore';
import { USER_DB_NAME } from '../../../../constants';
import { useSnackbarValue } from '../../../../snackBarContext';
import { db } from '../../../../fireStore';

const LogIn = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { toggle } = useSnackbarValue()


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !password) {
            toggle({
                open: true,
                message: 'Validation error',
                severity: 'error'
            })
            return
        }

        // const snapshot = await getDocs(collection(db, USER_DB_NAME));

        // const records = snapshot.docs.map((doc) => ({
        //     id: doc.id,
        //     ...doc.data()
        // }));
        // console.log('hex: ', records)

        toggle({
            open: true,
            message: 'Logged In',
            severity: 'success'
        })

    }
    return (
        <>
            <div className={styles['container']}>
                <h3>Log In</h3>
                <Grid container className={styles['form-container']} justifyContent={'center'}>
                    <Grid item lg={12}>
                        <TextField
                            placeholder='Email'
                            value={email}
                            name={"email"}
                            type='email'
                            onChange={e => setEmail(e.target.value)}
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