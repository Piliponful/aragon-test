import { Paper } from '@material-ui/core';

import { EventsList } from './EventsList'
import { UserData } from './UserData'
import { Transfer } from './Transfer'
import { TokenData } from './TokenData'

export const Main = () => {
  return (
    <>
      <Paper elevation={3} style={{ width: 500, padding: '15px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <UserData />
        <TokenData />
      </Paper>

      <Transfer />
      <EventsList />
    </>
  )
}