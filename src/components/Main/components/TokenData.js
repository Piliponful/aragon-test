import { useContext, useEffect, useState } from 'react'
import { Typography } from '@material-ui/core';
import { BigNumber, utils } from 'ethers'

import { EthersContext } from '../../../contexts/Ethers';

export const TokenData = () => {
  const [token, setToken] = useState({ symbol: '', myBalance: BigNumber.from('0'), totalSupply: BigNumber.from('0') })
  const { token: tkn, myAddress, provider } = useContext(EthersContext)

  const fetchTokenData = async () => {
    const symbol = await tkn.contract.symbol();
    const myBalance = await tkn.contract.balanceOf(myAddress);
    const totalSupply = await tkn.contract.totalSupply()

    setToken({ symbol, myBalance, totalSupply })
  }

  const registerTransferListeners = () => {
    const fromMyAddress = {
      address: tkn.address,
      topics: [
        utils.id("Transfer(address,address,uint256)"),
        utils.hexZeroPad(myAddress, 32)
      ]
    };

    const toMyAddress = {
      address: tkn.address,
      topics: [
        utils.id("Transfer(address,address,uint256)"),
        null,
        utils.hexZeroPad(myAddress, 32)
      ]
    };

    provider.on(fromMyAddress, fetchTokenData)
    provider.on(toMyAddress, fetchTokenData)
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