import './App.css';

import Sender from './Sender';
import { Container } from '@mui/system';
import { GlobalStyles } from '@mui/material';


function App() {

  return (
    <div className="App">
      <GlobalStyles styles={{body: { backgroundImage: `url(https://wallpaperaccess.com/full/2217435.jpg)`}}}/>
      <Container maxWidth="sm">
        <Sender />
      </Container>
      
    </div>
  );
}

export default App;
