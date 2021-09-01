import Container from '@material-ui/core/Container';

import { SignUp } from './components/SignUp'

function App() {
  return (
    <Container style={{ display: 'flex', justifyContent: 'center' }}>
      <SignUp />
    </Container>
  );
}

export default App;
