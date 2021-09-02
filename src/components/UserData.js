import { Typography, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack'
import { getAuth, signOut } from 'firebase/auth'

export const UserData = () => {
  const { enqueueSnackbar } = useSnackbar();

  const auth = getAuth()
  const userEmail = auth.currentUser.email;


  const signOutWithErrorHandling = () => {
    try {
      signOut(auth)
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
      <Typography variant="h6" gutterBottom>
        Hello {userEmail}
      </Typography>

      <Button variant="contained" color="primary" onClick={signOutWithErrorHandling}>
        Sign Out
      </Button>
    </div>
  )
}