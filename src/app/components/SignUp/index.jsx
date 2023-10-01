'use client'
import { Button, Grid, TextField } from '@mui/material';
import styles from './index.module.scss'
import { useState } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { USER_DB_NAME } from '../../../../constants';
import { db } from '../../../../fireStore';
import { useSnackbarValue } from '@/contexts/snackBarContext';
import { useRouter } from 'next/navigation';

const SignUp = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { toggle } = useSnackbarValue()
    const router = useRouter()

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

        const userRef = collection(db, USER_DB_NAME);
        const docRef = await addDoc(userRef, {
            name, email, password
        });

        toggle({
            open: true,
            message: 'Created',
            severity: 'success'
        })
        router.push('/log-in')

    }
    return (
        <>
            <div className={styles['container']}>
                <h3>Sign Up</h3>
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

export default SignUp;