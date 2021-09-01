import { useState } from 'react'
import Container from '@material-ui/core/Container';
import { SnackbarProvider } from 'notistack';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { SignUp } from './components/SignUp'
import { Main } from './components/Main'
import { Top5List } from './components/Top5List'

const App = () => {
  const [user, setUser] = useState(null)

  onAuthStateChanged(getAuth(), setUser);

  return (
    <SnackbarProvider maxSnack={3}>
      <Container style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {user ? <Main userEmail={user.email} /> : <SignUp />}
        <Top5List />
      </Container>
    </SnackbarProvider>
  );
}

export default App;
