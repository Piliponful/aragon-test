import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import { passwordStrength } from 'check-password-strength'
import { validate as isEmail } from 'isemail'

export const SignUp = () => {
  const [userData, setUserData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })

  const validateUserData = () => {
    const passwordStrengthResult = passwordStrength(userData.password)
    const newErrors = {
      email: isEmail(userData.email) ? '' : 'Email is incorrect',
      password: passwordStrengthResult.id === 3 ? '' : `Password is ${passwordStrengthResult.value}`
    }

    setErrors(newErrors)

    return !newErrors.email && !newErrors.password
  }

  const signUp = () => {
    const isValid = validateUserData()

    if (!isValid) {
      return
    }

    console.log('success')
  }

  return (
    <>
      <TextField
        id="standard-basic"
        label="Email"
        type="email"
        style={{ marginRight: '10px' }}
        onChange={e => setUserData({ ...userData, email: e.target.value })}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <TextField
        id="standard-password-input"
        label="Password"
        type="password"
        style={{ marginRight: '10px' }}
        onChange={e => setUserData({ ...userData, password: e.target.value })}
        error={Boolean(errors.password)}
        helperText={errors.password}
      />
      <Button variant="contained" color="primary" onClick={signUp}>
        Sign Up
      </Button>
    </>
  )
}