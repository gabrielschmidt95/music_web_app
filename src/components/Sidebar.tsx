import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Image, Row, Col, Button } from 'react-bootstrap'


import { SidebarData } from './SidebarData';

const SidebarBottom = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: start;
`

const SidebarMenu = styled.div` 
    width: 100%;
    height: 100vh;
    background-color: #36454f;
    transition: .6s;
`

const MenuItems = styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 80px;
`

const MenuItemLinks = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: 20px;
    text-decoration: none;
    color: #ffffff;

    &:hover {
        background-color: #ffffff;
        color: #000080;
        width: 100%;
        height: 45px;
        text-align: center;
        border-radius: 5px;
        margin: 0 1rem;
    }
`

const Home: React.FunctionComponent = () => {
    return (
        <>
            <SidebarMenu>
                <h2 style={{ marginLeft: '16px', color: 'white', paddingTop: '1rem' }}>Music Collection</h2>
                {SidebarData.map((item) => {
                    return (
                        <MenuItems key={item.title}>
                            <MenuItemLinks to={item.path} onClick={
                                () => {
                                    console.log(sessionStorage.getItem('currentPage'));
                                    if (sessionStorage.getItem('currentPage') === item.path) {
                                        window.location.reload();
                                    }   
                                    sessionStorage.setItem('currentPage', item.path);
                                }

                            }>
                                {item.icon}
                                <span style={{ marginLeft: '16px' }}>{item.title}</span>
                            </MenuItemLinks>
                        </MenuItems>
                    )
                })}

            </SidebarMenu>
            <SidebarBottom>
                <Row>
                    <Col >
                        <Image src={JSON.parse(localStorage.getItem('user') ?? '{}').photoURL} roundedCircle style={{ width: '50px', height: '50px', marginLeft: '16px' }} />
                    </Col>
                    <Col >
                        <span style={{ marginLeft: '16px', color: 'white' }}>{JSON.parse(localStorage.getItem('user') ?? '{}').displayName}</span>
                    </Col>
                    <Col >
                        <Button variant="outline-light" style={{ marginLeft: '16px', marginTop: '1rem' }} onClick={() => { localStorage.removeItem('user'); window.location.reload() }}>Logout</Button>
                    </Col>
                </Row>
            </SidebarBottom >
        </>
    )
}

export default Home