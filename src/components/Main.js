import { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack'
import { getAuth, signOut } from 'firebase/auth'
import { ethers, BigNumber } from 'ethers'

import tokenABI from '../tokenABI.json'

const contractAddress = '0xff10E56d8C3c1567E0c80677e26EC687B4f1D8D0'

export const Main = ({ userEmail }) => {
  const providerRef = useRef(null)
  const tokenContractRef = useRef(null)
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

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    providerRef.current = provider
    setMetamaskConnected(true)
  }

  const getMyAddress = async () => {
    const signer = providerRef.current.getSigner()
    return signer.getAddress()
  }

  const fetchTokenData = async () => {
    const myAddress = await getMyAddress()

    const symbol = await tokenContractRef.current.symbol();
    const myBalance = await tokenContractRef.current.balanceOf(myAddress);
    const totalSupply = await tokenContractRef.current.totalSupply()

    setToken({ symbol, myBalance, totalSupply })
  }
  
  const initializeTokenContract = () => {
    const tokenContract = new ethers.Contract(contractAddress, tokenABI, providerRef.current);
    const signer = providerRef.current.getSigner()
    tokenContractRef.current = tokenContract.connect(signer)
  }

  const registerTransferListeners = async () => {
    const myAddress = await getMyAddress()

    const fromMyAddress = {
      address: contractAddress,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
        ethers.utils.hexZeroPad(myAddress, 32)
      ]
    };
  
    // List all token transfers  *to*  myAddress:
    const toMyAddress = {
        address: contractAddress,
        topics: [
          ethers.utils.id("Transfer(address,address,uint256)"),
          null,
          ethers.utils.hexZeroPad(myAddress, 32)
        ]
    };

    providerRef.current.on(fromMyAddress, fetchTokenData)
    providerRef.current.on(toMyAddress, fetchTokenData)
  }

  const transfer = () => {
    if (token.myBalance.sub(transferData.amount).lt(0)) {
      setAmountError(true)
      return
    }
    if (amountError) {
      setAmountError(false)
    }
    tokenContractRef.current.transfer(transferData.addressTo, transferData.amount)
  }

  useEffect(() => {
    if (metamaskConnected) {
      initializeTokenContract()
      fetchTokenData()
      registerTransferListeners()
    }
  }, [metamaskConnected])

  if (!metamaskConnected) {
    return (
      <Button variant="contained" color="secondary" onClick={connectToMetamask}>
        Connect To Metamask
      </Button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <p>Hello {userEmail}</p>
      <p>Your {token.symbol} Balance: {token.myBalance.toString()}</p>
      <p>Total {token.symbol} Supply: {token.totalSupply.toString()}</p>

      <div style={{ marginTop: '10px' }}>
        <Button variant="contained" color="primary" onClick={signOutWithErrorHandling}>
          Sign Out
        </Button>
      </div>

      <TextField
        id="address-to"
        label="Address To"
        type="text"
        onChange={e => setTransferData({ ...transferData, addressTo: e.target.value })}
      />

      <TextField
        id="amount"
        label="amount"
        type="number"
        onChange={e => setTransferData({ ...transferData, amount: e.target.value })}
        error={amountError}
        helperText={amountError ? 'Amount is too big' : ''}
      />

      <div style={{ marginTop: '10px' }}>
        <Button variant="contained" color="primary" onClick={transfer}>
          Transfer
        </Button>
      </div>
    </div>
  )
}