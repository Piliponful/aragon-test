import { useEffect, useState } from 'react'
import { Paper, List, ListItem, Tooltip, Typography, Link, Divider } from '@material-ui/core';

import { ethers } from 'ethers'

import tokenABI from '../contract/tokenABI.json'
import contractAddress from '../contract/address'

export const EventsList = () => {
  const [events, setEvents] = useState([])

  const registerEventListeners = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const allEventsForTKN = {
      address: contractAddress,
      topics: []
    };

    provider.on(allEventsForTKN, newEvent => {
      const iface = new ethers.utils.Interface(tokenABI)
      setEvents([...events, { event: newEvent, parsedLog: iface.parseLog(newEvent) }])
    })
  }
  
  useEffect(() => {
    registerEventListeners()
  }, [])

  return (
    <Paper elevation={3} style={{ width: 500, marginTop: 25, padding: '15px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Current TKN Events
      </Typography>
      <List dense={false}>
        {events.map((i, index) => (
          <div key={index}>
            <ListItem style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Tooltip title="Block Number">
                  <Link href="#" onClick={e => e.preventDefault()}>
                    # {i.event.blockNumber}
                  </Link>
                </Tooltip>
                <Tooltip title="Tx Hash">
                  <Link href="#" onClick={e => e.preventDefault()}>
                    {i.event.transactionHash.slice(0, 15) + '...'}
                  </Link>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{i.parsedLog.signature}</span>
                arguments: {i.parsedLog.args.map((i, index) => (
                  <span style={{ overflow: 'hidden', width: 250, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {index}: {i + ''}
                  </span>
                ))}
              </div>
            </ListItem>
            {index === events.length - 1 ? null : <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  )
}