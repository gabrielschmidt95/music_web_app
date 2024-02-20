import { StrictMode } from 'react';
import './index.css';
import Main from './Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import Sidebar from './components/Sidebar';
import { Row, Col, Container, Button, Spinner, Image } from 'react-bootstrap';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import logo from './assets/music-collection-high-resolution-logo.png';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement as HTMLElement);

const App = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (isLoading) return (
    <Container style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }
    }>
      <Row>
        <Col>
          <Spinner animation="border"></Spinner>
        </Col>
      </Row>
    </Container>
  )

  if (!isAuthenticated) {
    return (
      <Container style={
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }
      }>
        <Row>
          <Col>
            <Image src={logo} fluid roundedCircle/>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => loginWithRedirect()}>Entrar</Button>
          </Col>
        </Row>
      </Container>
    )
  }

  localStorage.setItem('user', JSON.stringify(user))

  return (
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
  )
}

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <StrictMode>
      <App />
    </StrictMode >

  </Auth0Provider>,
);