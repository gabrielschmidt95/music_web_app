import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Main from './Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";

import Sidebar from './components/Sidebar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Container fluid style={{ paddingLeft: '0', backgroundColor: '#f8f9fa', height: '100vh', position: 'fixed'}}>
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
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();