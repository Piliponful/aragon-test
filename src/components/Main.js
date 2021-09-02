import { useEffect, useState } from 'react'
import { Typography, Paper, TextField, Button } from '@material-ui/core';
import { useSnackbar } from 'notistack'
import { getAuth, signOut } from 'firebase/auth'
import { ethers, BigNumber } from 'ethers'

import { EventsList } from './EventsList'

import tokenABI from '../contract/tokenABI.json'
import contractAddress from '../contract/address'

const provider = new ethers.providers.Web3Provider(window.ethereum)
let tokenContract = new ethers.Contract(contractAddress, tokenABI, provider);
let myAddress = null

export const Main = ({ userEmail }) => {
  const [token, setToken] = useState({ symbol: '', myBalance: BigNumber.from('0'), totalSupply: BigNumber.from('0') })
  const [transferData, setTransferData] = useState({ addressTo: null, amount: 0 })
  const [amountError, setAmountError] = useState(false)
  const [metamaskConnected, setMetamaskConnected] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const signOutWithErrorHandling = () => {
    try {
      signOut(getAuth())
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  const setGlobals = async () => {
    const signer = provider.getSigner()
    tokenContract = tokenContract.connect(signer)
    myAddress = await signer.getAddress()
  }

  const fetchTokenData = async () => {
    const symbol = await tokenContract.symbol();
    const myBalance = await tokenContract.balanceOf(myAddress);
    const totalSupply = await tokenContract.totalSupply()

    setToken({ symbol, myBalance, totalSupply })
  }

  const registerTransferListeners = async () => {
    const fromMyAddress = {
      address: contractAddress,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
        ethers.utils.hexZeroPad(myAddress, 32)
      ]
    };
  
    const toMyAddress = {
        address: contractAddress,
        topics: [
          ethers.utils.id("Transfer(address,address,uint256)"),
          null,
          ethers.utils.hexZeroPad(myAddress, 32)
        ]
    };

    provider.on(fromMyAddress, fetchTokenData)
    provider.on(toMyAddress, fetchTokenData)
  }

  const initialize = async () => {
    await setGlobals()
    await fetchTokenData()
    await registerTransferListeners()
  }

  const transfer = () => {
    if (token.myBalance.sub(transferData.amount).lt(0)) {
      setAmountError(true)
      return
    }

    if (amountError) {
      setAmountError(false)
    }

    tokenContract.transfer(transferData.addressTo, transferData.amount)
  }
  
  const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts()
    setMetamaskConnected(accounts.length > 0)
  }

  useEffect(() => {
    isMetaMaskConnected()
  }, [])

  useEffect(() => {
    if (metamaskConnected) {
      initialize()
    }
  }, [metamaskConnected])

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
      <Button variant="contained" color="secondary" onClick={connectToMetamask}>
        Connect To Metamask
      </Button>
    )
  }

  return (
    <>
      <Paper elevation={3} style={{ width: 500, padding: '15px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
          <Typography variant="h6" gutterBottom>
            Hello {userEmail}
          </Typography>

          <Button variant="contained" color="primary" onClick={signOutWithErrorHandling}>
            Sign Out
          </Button>
        </div>
        <Typography variant="subtitle1">
          Your {token.symbol} Balance: {token.myBalance.toString()}
        </Typography>
        <Typography variant="subtitle1" style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: 250, whiteSpace: 'nowrap' }}>
          Total {token.symbol} Supply: {token.totalSupply.toString()}
        </Typography>
      </Paper>

      <Paper elevation={3} style={{ marginTop: 25, padding: '15px', width: 500, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Transfer funds
        </Typography>

        <TextField
          id="address-to"
          label="Address To"
          type="text"
          onChange={e => setTransferData({ ...transferData, addressTo: e.target.value })}
          style={{ marginTop: '15px' }}
        />

        <TextField
          id="amount"
          label="Amount"
          type="number"
          onChange={e => setTransferData({ ...transferData, amount: e.target.value })}
          error={amountError}
          helperText={amountError ? 'Amount is too big' : ''}
          style={{ marginTop: '15px' }}
        />

        <div style={{ marginTop: '15px' }}>
          <Button variant="contained" color="primary" onClick={transfer}>
            Transfer
          </Button>
        </div>
      </Paper>
      <EventsList />
    </>
  )
}