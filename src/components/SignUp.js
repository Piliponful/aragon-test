import { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useSnackbar } from 'notistack';

export const SignUp = () => {
  const [userData, setUserData] = useState({ email: '', password: '' })
  const { enqueueSnackbar } = useSnackbar();

  const auth = getAuth()

  const catchError = async fn => {
    try {
      await fn()
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  const signUp = () => catchError(() => createUserWithEmailAndPassword(auth, userData.email, userData.password))

  const signIn = () => catchError(() => signInWithEmailAndPassword(auth, userData.email, userData.password))

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <TextField
        id="standard-basic"
        label="Email"
        type="email"
        style={{ marginRight: '10px' }}
        onChange={e => setUserData({ ...userData, email: e.target.value })}
      />
      <TextField
        id="standard-password-input"
        label="Password"
        type="password"
        style={{ marginRight: '10px' }}
        onChange={e => setUserData({ ...userData, password: e.target.value })}
      />
      <Button variant="contained" color="primary" onClick={signUp} style={{ marginRight: '10px' }}>
        Sign Up
      </Button>
      <Button variant="contained" color="primary" onClick={signIn}>
        Sign In
      </Button>
    </div>
  )
}