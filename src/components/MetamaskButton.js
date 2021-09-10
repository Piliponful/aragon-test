import { useContext } from 'react'
import { Button, CircularProgress } from '@material-ui/core';

import { EthersContext } from '../contexts/Ethers';

export const MetamaskButton = ({ children }) => {
  const { metamask, initialized } = useContext(EthersContext)

  if (!metamask.connected) {
    return (
      <div style={{ position: 'absolute', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          (metamask.connected === null || !initialized)
            ? <CircularProgress />
            : (
              <Button variant="contained" color="secondary" onClick={metamask.connect}>
                Connect To Metamask
              </Button>
            )
        }
      </div>
    )
  }

  return children
}