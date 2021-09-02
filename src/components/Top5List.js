import { useState, useEffect } from 'react'
import { List, ListItem, ListItemText, Typography, Paper, Divider } from '@material-ui/core';

const apiKey = 'b68a21be-5da2-441f-87d3-34cf05946b8b'

export const Top5List = () => {
  const [top5List, setTop5List] = useState([])
  const [ANTPrice, setANTPrice] = useState(null)

  const getAndSetTop5 = async () => {
    const queryParams = new URLSearchParams({
      limit: '5'
    })

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?' + queryParams, { headers: { 'X-CMC_PRO_API_KEY': apiKey } })
    const { data } = await response.json()
    setTop5List(data.map(i => ({ name: i.name, price: i.quote.USD.price })))
  }

  const getAndSetANT = async () => {
    const queryParams = new URLSearchParams({
      symbol: 'ANT'
    })

    const response = await fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?' + queryParams, { headers: { 'X-CMC_PRO_API_KEY': apiKey } })
    const { data } = await response.json()
    setANTPrice(data.ANT.quote.USD.price)
  }

  const getAllCrypto = () => {
    getAndSetTop5()
    getAndSetANT()
  }

  useEffect(() => {
    getAllCrypto()
    // const interval = setInterval(getAllCrypto, 10000)

    // return () => clearInterval(interval)
  }, [])
  
  return (
    <Paper elevation={3} style={{ marginTop: 25, padding: '15px', width: 500, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Top 5 crypto
      </Typography>
      <List dense={false}>
        {top5List.map((i, index) => (
          <div key={i.name}>
            <ListItem>
              <ListItemText
                primary={i.name}
                secondary={i.price}
              />
            </ListItem>
            {index === top5List.length - 1 ? null : <Divider />}
          </div>
        ))}
        <Typography variant="h6" gutterBottom>
          One and only ❤
        </Typography>
        <ListItem>
          <ListItemText
            primary='Aragon'
            secondary={ANTPrice}
          />
        </ListItem>
      </List>
    </Paper>
  )
}