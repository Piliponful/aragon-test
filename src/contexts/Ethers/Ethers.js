import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { ethers, utils } from 'ethers'
import { debounce } from 'lodash'

import tokenABI from './tokenABI.json'
import contractAddress from './address'

export const EthersContext = React.createContext({});

const provider = new ethers.providers.Web3Provider(window.ethereum)
const iface = new utils.Interface(tokenABI)
let tokenContract = new ethers.Contract(contractAddress, tokenABI, provider);

export const EthersProvider = ({ children }) => {
  const [metamaskConnected, setMetamaskConnected] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [myAddress, setMyAddress] = useState(null)
  const { enqueueSnackbar } = useSnackbar();

  const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts()
    debounce(() => setMetamaskConnected(accounts.length > 0), 1000)()
  }

  const initialize = async () => {
    const signer = provider.getSigner()
    tokenContract = tokenContract.connect(signer)

    const myAddress = await signer.getAddress()
    setMyAddress(myAddress)

    setInitialized(true)
  }

  const connectToMetamask = async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      setMetamaskConnected(true)
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }

  useEffect(() => {
    isMetaMaskConnected()
  }, [])

  useEffect(() => {
    initialize()
  }, [])

  return (
    <EthersContext.Provider value={{
      metamask: { connect: connectToMetamask, connected: metamaskConnected },
      token: { contract: tokenContract, address: contractAddress, iface },
      provider,
      myAddress,
      initialized
    }}>
      {children}
    </EthersContext.Provider>
  )
}