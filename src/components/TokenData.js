import { useEffect, useState, useRef } from 'react'
import { Typography } from '@material-ui/core';
import { ethers, BigNumber } from 'ethers'

import tokenABI from '../contract/tokenABI.json'
import contractAddress from '../contract/address'

export const TokenData = () => {
  const providerRef = useRef(new ethers.providers.Web3Provider(window.ethereum))
  const [token, setToken] = useState({ symbol: '', myBalance: BigNumber.from('0'), totalSupply: BigNumber.from('0') })

  const fetchTokenData = async () => {
    const tokenContract = new ethers.Contract(contractAddress, tokenABI, providerRef.current);
    const signer = providerRef.current.getSigner()

    const symbol = await tokenContract.symbol();
    const myBalance = await tokenContract.balanceOf(await signer.getAddress());
    const totalSupply = await tokenContract.totalSupply()

    setToken({ symbol, myBalance, totalSupply })
  }
  
  const registerTransferListeners = async () => {
    const signer = providerRef.current.getSigner()
    const myAddress = await signer.getAddress()

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

    providerRef.current.on(fromMyAddress, fetchTokenData)
    providerRef.current.on(toMyAddress, fetchTokenData)
  }

  useEffect(() => {
    fetchTokenData()
    registerTransferListeners()
  }, [])

  return (
    <>
      <Typography variant="subtitle1">
          Your {token.symbol} Balance: {token.myBalance.toString()}
      </Typography>
      <Typography variant="subtitle1" style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: 250, whiteSpace: 'nowrap' }}>
          Total {token.symbol} Supply: {token.totalSupply.toString()}
      </Typography>
    </>
  )
}