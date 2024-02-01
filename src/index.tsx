import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";

import Sidebar from './components/Sidebar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from './services/Firebase';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account "
});

async function signInWithGoogle() {
  const googleAuth = getAuth();
  const signInWithGooglePopup = () => signInWithPopup(googleAuth, provider);
  await signInWithGooglePopup();
  const user = auth.currentUser;
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    App();
  } else {
    console.log('Error');
  }
}

function App() {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Container fluid style={{ paddingLeft: '0', backgroundColor: '#f8f9fa', height: '100vh', position: 'fixed' }}>
          <Row>
            <Col md={2}>
              <Sidebar />
            </Col>
            <Col xs={10} style={{ paddingTop: '2rem' }}>
              <Main />
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    </React.StrictMode >,
    document.getElementById('root')
  )
}

if (!localStorage.getItem('user')) {
  signInWithGoogle();
} else {
  App();
}

