import { useEffect, useState } from 'react'
import { Button, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack'
import { ethers } from 'ethers'
import { debounce } from 'lodash'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export const MetamaskButton = ({ children }) => {
  const [metamaskConnected, setMetamaskConnected] = useState(null)
  const { enqueueSnackbar } = useSnackbar();
  
  const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts()
    debounce(() => setMetamaskConnected(accounts.length > 0), 1000)()
  }

  useEffect(() => {
    isMetaMaskConnected()
  }, [])

  if (!metamaskConnected) {
    const connectToMetamask = async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        setMetamaskConnected(true)
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  
    return (
      <div style={{ position: 'absolute', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          metamaskConnected === null
          ? <CircularProgress />
          : (
            <Button variant="contained" color="secondary" onClick={connectToMetamask}>
                Connect To Metamask
            </Button>
          )
        }
      </div>
    )
  }

  return children
}