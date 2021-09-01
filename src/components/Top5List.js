import { useState, useEffect } from 'react'

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

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
    const interval = setInterval(getAllCrypto, 10000)

    return () => clearInterval(interval)
  }, [])
  
  return (
    <List dense={false}>
      {top5List.map(i => (
        <ListItem key={i.name}>
          <ListItemText
            primary={i.name}
            secondary={i.price}
          />
        </ListItem>
      ))}
      <ListItem>
        <ListItemText
          primary='Aragon'
          secondary={ANTPrice}
        />
      </ListItem>
    </List>
  )
}