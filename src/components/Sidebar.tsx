import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Image, Spinner } from 'react-bootstrap'
import { FaFileCsv, FaFileCode, FaAccusoft, FaUser, FaTasks } from 'react-icons/fa'
import { ExportCollection } from '../services/Albuns';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const SidebarBottom = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: start;
    justify-content: start;
    padding-bottom: 1rem;   
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

const MenuItemButton = styled.div`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: 20px;
    text-decoration: none;
    color: #ffffff;
    cursor: pointer;
    
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

const SidebarData = [
    {
        title: 'Gerenciador',
        path: '/manager',
        icon: <FaAccusoft />
    },
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <FaTasks />
    },
    {
        title: 'Artistas',
        path: '/artists',
        icon: <FaUser />
    }
]

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <MenuItemButton onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
        </MenuItemButton>
    );
};

const Home: React.FunctionComponent = () => {
    const [exportLoadingCSV, setExportLoadingCSV] = useState(false);
    const [exportLoadingJSON, setExportLoadingJSON] = useState(false);
    const { user } = useAuth0();
    return (
        <SidebarMenu>
            <h2 style={{ marginLeft: '16px', color: 'white', paddingTop: '1rem' }}>Music Collection</h2>
            <hr style={{ width: '90%', marginLeft: '16px', color: "white" }}></hr>
            {SidebarData.map((item) => {
                return (
                    <MenuItems key={item.title}>
                        <MenuItemLinks to={item.path}>
                            {item.icon}
                            <span style={{ marginLeft: '16px' }}>{item.title}</span>
                        </MenuItemLinks>
                    </MenuItems>
                )
            })}
            <hr style={{ width: '90%', marginLeft: '16px', color: "white" }}></hr>
            <MenuItems>
                <MenuItemButton
                    onClick={
                        () => {
                            if (exportLoadingCSV) {
                                return;
                            }
                            setExportLoadingCSV(true);
                            ExportCollection().then(data => {
                                const headers = 'RELEASE_YEAR;ARTIST;TITLE;MEDIA;PURCHASE;ORIGIN;EDITION_YEAR;IFPI_MASTERING;IFPI_MOULD;BARCODE;MATRIZ;LOTE;OBS;DISCOGS_ID;SPOTIFY_ID\n'
                                const csv = data.map((item) => {
                                    return [
                                        item.releaseYear,
                                        item.artist,
                                        item.title,
                                        item.media,
                                        item.purchase,
                                        item.origin,
                                        item.editionYear,
                                        item.ifpiMastering,
                                        item.ifpiMould,
                                        item.barcode,
                                        item.matriz,
                                        item.lote,
                                        item.obs,
                                        item.discogs.id,
                                        item.spotify.id,
                                    ].join(';').replace(/(\r\n|\n|\r)/gm, "")
                                }).join('\n')
                                const universalBOM = "\uFEFF";
                                const csvData = universalBOM + headers + csv;
                                const blob = new Blob([csvData], { type: 'text/csv' })
                                const hiddenElement = document.createElement('a')
                                hiddenElement.href = window.URL.createObjectURL(blob)
                                hiddenElement.target = '_blank'
                                hiddenElement.download = 'collection.csv'
                                hiddenElement.click()
                                setExportLoadingCSV(false);
                            }
                            )

                        }

                    }>
                    <FaFileCsv></FaFileCsv><span style={{ marginLeft: '16px' }}>Exportar CSV</span>
                    {exportLoadingCSV && <Spinner style={{ marginLeft: '16px' }}></Spinner>}
                </MenuItemButton>
            </MenuItems>
            <MenuItems>
                <MenuItemButton
                    onClick={
                        () => {
                            if (exportLoadingJSON) {
                                return;
                            }
                            setExportLoadingJSON(true);
                            console.log('exporting JSON')
                            ExportCollection().then(data => {
                                const hiddenElement = document.createElement('a')
                                hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(JSON.stringify(data))
                                hiddenElement.target = '_blank'
                                hiddenElement.download = 'collection.json'
                                hiddenElement.click()
                                setExportLoadingJSON(false);
                            })
                        }
                    }>
                    <FaFileCode></FaFileCode><span style={{ marginLeft: '16px' }}>Exportar JSON</span>
                    {exportLoadingJSON && <Spinner style={{ marginLeft: '16px' }}></Spinner>}
                </MenuItemButton>
            </MenuItems>
            <hr style={{ width: '90%', marginLeft: '16px', color: "white" }}></hr>
            <MenuItems>
                <LogoutButton></LogoutButton>
            </MenuItems>
            <hr style={{ width: '90%', marginLeft: '16px', color: "white" }}></hr>
            <SidebarBottom>
                <Image src={user?.picture} roundedCircle style={{ width: '50px', height: '50px', marginLeft: '16px' }} />
            </SidebarBottom>
        </SidebarMenu>
    )
}

export default Home