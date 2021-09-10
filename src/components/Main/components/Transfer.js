import { useContext, useState } from 'react'
import { Typography, Paper, TextField, Button } from '@material-ui/core';

import { EthersContext } from '../../../contexts/Ethers';

export const Transfer = () => {
  const { token, myAddress } = useContext(EthersContext)
  const [transferData, setTransferData] = useState({ addressTo: null, amount: 0 })
  const [amountError, setAmountError] = useState(false)

  const transfer = async () => {
    const myBalance = await token.contract.balanceOf(myAddress);

    if (myBalance.sub(transferData.amount).lt(0)) {
      setAmountError(true)
      return
    }

    if (amountError) {
      setAmountError(false)
    }

    token.contract.transfer(transferData.addressTo, transferData.amount)
  }

  return (
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
  )
}