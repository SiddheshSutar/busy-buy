'use client'
import { Button, TextField } from '@mui/material';
import styles from './index.module.scss'
import { useState } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { USER_DB_NAME } from '../../../../constants';
import { useSnackbarValue } from '../../../../snackBarContext';

const Login = () => {

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

        toggle({
            open: true,
            message: 'Created',
            severity: 'success'
        })

        // const userRef = collection(db, USER_DB_NAME);
        // const docRef = await addDoc(userRef, {
        //     name, email, password
        // });

    }
    return (
        <>
            <div className={styles.container}>
                <TextField
                    value={name}
                    name={"name"}
                    type='text'
                    onChange={e => setName(e.target.value)}
                />
                <TextField
                    value={email}
                    name={"email"}
                    type='email'
                    onChange={e => setEmail(e.target.value)}
                />
                <TextField
                    value={password}
                    name='password'
                    type='password'
                    onChange={e => setPassword(e.target.value)}
                />
                <Button type='button' color='primary' onClick={e => handleSubmit(e)}>
                    Submit
                </Button>
            </div>
        </>
    );
}

export default Login;