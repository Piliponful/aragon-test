import { useState } from 'react'
import Container from '@material-ui/core/Container';
import { SnackbarProvider } from 'notistack';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { SignUp } from './components/SignUp'
import { Main } from './components/Main'
import { Top5List } from './components/Top5List'
import { MetamaskButton } from './components/MetamaskButton'

const App = () => {
  const [user, setUser] = useState(null)

  onAuthStateChanged(getAuth(), setUser);

  return (
    <SnackbarProvider maxSnack={3}>
      <MetamaskButton>
        <Container style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          {!user ? <SignUp /> : null}
          {user ? <Main /> : null}
          {user ? <Top5List /> : null}
        </Container>
      </MetamaskButton>
    </SnackbarProvider>
  );
}

export default App;
