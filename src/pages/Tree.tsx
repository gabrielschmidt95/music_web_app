import { Container, Row, Col, Button, Accordion, Spinner } from 'react-bootstrap'
import Artists from '../services/Artists'
import { useState } from 'react';
import AlbumData from '../models/Album';
import AlbumInfo from '../components/AlbumInfo';
import ModalDelete from '../components/ModalDelete';
import ModalFixDiscogs from '../components/ModalFixDiscogs';
import ModalEdit from '../components/ModalEdit';
import { FetchAlbums, RemoveAlbum, UpdateDiscogs } from '../services/Albuns';


const TreeList: React.FunctionComponent = () => {
    const [albuns, setAlbuns] = useState<AlbumData[]>([]);
    const [albumInfo, setAlbumInfo] = useState<AlbumData>();
    const [modalType, setModalType] = useState<string>("None");

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [showModalFixDiscogs, setShowModalFixDiscogs] = useState(false);
    const handleCloseModalFixDiscogs = () => setShowModalFixDiscogs(false);
    const handleShowModalFixDiscogs = () => setShowModalFixDiscogs(true);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleCloseModalDelete = () => setShowModalDelete(false);
    const handleShowModalDelete = () => setShowModalDelete(true);

    const [validatedFixDiscogs, setValidatedFixDiscogs] = useState(false);
    const [fixDiscogs, setFixDiscogs] = useState<string>('');
    const [artist, setArtist] = useState<{ id: string; name: string; }>();


    const albunsByArtist = (artist: string) => {
        FetchAlbums(artist).then((data) => {
            setAlbuns(data)
        });
    }
    function clearContent() {
        setAlbuns([]);
        setAlbumInfo(undefined);
        setArtist(undefined);
    }

    function refreshArtists(album: AlbumData) {
        clearContent();
        handleCloseModal();
        alert(`Album ${album.title} atualizado!`);
        setArtist({ id: album.artist, name: album.artist });
        FetchAlbums(album.artist).then((data) => {
            setAlbuns(data)
        });
        setAlbumInfo(album)
    }

    function removeAlbum(albumInfo: AlbumData) {
        RemoveAlbum(albumInfo.id).then((_) => {
            clearContent();
            setAlbuns([]);
            setAlbumInfo(undefined);
            handleCloseModalDelete();
            FetchAlbums(albumInfo.artist).then((data) => {
                setAlbuns(data)
            });
        });
    }

    const handleSubmitFixDiscogs = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (albumInfo === undefined) {
            return;
        }
        event.preventDefault();
        setValidatedFixDiscogs(true);
        UpdateDiscogs(fixDiscogs, albumInfo).then((v) => {
            if (v === undefined) {
                alert("Não encontrado no Discogs");
            }
            alert("Atualizado com sucesso!");
            clearContent();
            handleCloseModalFixDiscogs();
            FetchAlbums(albumInfo.artist).then((data) => {
                setAlbuns(data)
            });
        });

    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Árvore</h1>
            <hr style={{ width: '90%', marginLeft: '16px' }}></hr>
            <Container fluid
                style={
                    {
                        padding: '1rem',
                        height: '90vh',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        borderRadius: '1rem'
                    }
                }>
                <Row>
                    <Col xs={5}
                        style={
                            {
                                padding: '1rem',
                                height: '85vh',
                                overflowY: 'auto',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                borderRadius: '1rem',
                                margin: '1rem'
                            }
                        }>
                        <Accordion>
                            {
                                Artists().map((artist, index) => {
                                    return (
                                        <Accordion.Item eventKey={index.toString()} key={index} onClick={
                                            () => {
                                                albunsByArtist(artist.name)
                                            }
                                        }>
                                            <Accordion.Header>{artist.name}</Accordion.Header>
                                            <Accordion.Body>
                                                {
                                                    albuns.length === 0 ? <Spinner animation="border" /> :
                                                        albuns.map((album, index) => {
                                                            return (
                                                                <Button key={index} variant="light" style={{ width: '100%', textAlign: 'left' }}
                                                                    onClick={
                                                                        () => {
                                                                            setAlbumInfo(album)
                                                                        }
                                                                    }>
                                                                    {album.releaseYear} - {album.title}</Button>
                                                            )
                                                        })
                                                }
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })
                            }
                        </Accordion>
                    </Col>
                    <Col xs={6}
                        style={
                            {
                                padding: '1rem',
                                height: '85vh',
                                overflowY: 'auto',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                borderRadius: '1rem',
                                margin: '1rem'
                            }
                        }>
                        <AlbumInfo
                            albumInfo={albumInfo as AlbumData}
                            handleShowModalDelete={handleShowModalDelete}
                            handleShowModalFixDiscogs={handleShowModalFixDiscogs}
                            handleShowModal={handleShowModal}
                            setModalType={setModalType}
                        />
                    </Col>
                </Row>
            </Container>
            <ModalEdit
                albumInfo={albumInfo as AlbumData}
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                modalType={modalType}
                refreshArtists={refreshArtists}
            />
            <ModalFixDiscogs
                showModalFixDiscogs={showModalFixDiscogs}
                validatedFixDiscogs={validatedFixDiscogs}
                handleCloseModalFixDiscogs={handleCloseModalFixDiscogs}
                handleSubmitFixDiscogs={handleSubmitFixDiscogs}
                setFixDiscogs={setFixDiscogs}
                albumInfo={albumInfo as AlbumData}
            />
            <ModalDelete
                albumInfo={albumInfo as AlbumData}
                showModalDelete={showModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                removeAlbum={removeAlbum}
            />
        </>
    )
}

export default TreeList