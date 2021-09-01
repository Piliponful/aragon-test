import { useState } from 'react'
import Container from '@material-ui/core/Container';
import { SnackbarProvider } from 'notistack';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { SignUp } from './components/SignUp'
import { Main } from './components/Main'

const App = () => {
  const [user, setUser] = useState(null)

  onAuthStateChanged(getAuth(), setUser);

  return (
    <SnackbarProvider maxSnack={3}>
      <Container>
        {user ? <Main userEmail={user.email} /> : <SignUp />}
      </Container>
    </SnackbarProvider>
  );
}

export default App;
