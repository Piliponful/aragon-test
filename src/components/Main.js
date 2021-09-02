import { useEffect, useState } from 'react'
import { Typography, Paper, TextField, Button } from '@material-ui/core';
import { ethers, BigNumber } from 'ethers'

import { EventsList } from './EventsList'
import { UserData } from './UserData'

import tokenABI from '../contract/tokenABI.json'
import contractAddress from '../contract/address'

const provider = new ethers.providers.Web3Provider(window.ethereum)
let tokenContract = new ethers.Contract(contractAddress, tokenABI, provider);
let myAddress = null

export const Main = () => {
  const [token, setToken] = useState({ symbol: '', myBalance: BigNumber.from('0'), totalSupply: BigNumber.from('0') })
  const [transferData, setTransferData] = useState({ addressTo: null, amount: 0 })
  const [amountError, setAmountError] = useState(false)

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

  useEffect(() => {
    initialize()
  }, [])

  return (
    <>
      <Paper elevation={3} style={{ width: 500, padding: '15px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <UserData />
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