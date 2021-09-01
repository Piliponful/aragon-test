import Button from '@material-ui/core/Button'
import { useSnackbar } from 'notistack';
import { getAuth, signOut } from "firebase/auth";
import { ethers } from "ethers";

export const Main = ({ userEmail }) => {
  const { enqueueSnackbar } = useSnackbar();

  const signOutWithErrorHandling = () => {
    try {
      signOut(getAuth())
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      Hello {userEmail}
      <div style={{ marginTop: '10px' }}>
        <Button variant="contained" color="primary" onClick={signOutWithErrorHandling}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}