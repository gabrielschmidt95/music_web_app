import AppRoutes from './routes';
import Sidebar from './components/Sidebar';
import { Row, Col, Container, Spinner, Image } from 'react-bootstrap';

import { BrowserRouter } from "react-router-dom";

import logo from './assets/music-collection-logo.png';
import { useAuth0 } from '@auth0/auth0-react';


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
        setTimeout(() => {
            loginWithRedirect()
        }, 1000)
        return (
            <Container style={
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    cursor: 'pointer',
                    opacity: "0",
                    transition: "width 1s, height 1s, opacity 1s 1s"
                }
            }>
                <Row>
                    <Col>
                        <Image src={logo} fluid roundedCircle
                        />
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
                        <AppRoutes />
                    </Col>
                </Row>
            </Container>
        </BrowserRouter>
    )
}

export default App;