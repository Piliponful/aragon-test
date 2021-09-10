import { Paper } from '@material-ui/core';

import { EventsList } from './components/EventsList'
import { UserData } from './components/UserData'
import { Transfer } from './components/Transfer'
import { TokenData } from './components/TokenData'

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