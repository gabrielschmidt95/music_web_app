import React, { useState } from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap';

import AlbumData from '../models/Album'
import Artist from '../models/Artist'

import Artists from '../services/Artists'
import { FetchAlbums, RemoveAlbum, UpdateDiscogs } from '../services/Albuns';

import SelectArtist from '../components/SelectArtists';
import AlbumInfo from '../components/AlbumInfo';
import ModalDelete from '../components/ModalDelete';
import ModalFixDiscogs from '../components/ModalFixDiscogs';
import ModalEdit from '../components/ModalEdit';
import Discograpy from '../components/Discograpy';

const Home: React.FunctionComponent = () => {
    const [albuns, setAlbuns] = useState<AlbumData[]>();
    const [albumInfo, setAlbumInfo] = useState<AlbumData>();
    const [artist, setArtist] = useState<Artist>();

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);


    const [showModalFixDiscogs, setShowModalFixDiscogs] = useState(false);
    const handleCloseModalFixDiscogs = () => setShowModalFixDiscogs(false);
    const handleShowModalFixDiscogs = () => setShowModalFixDiscogs(true);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleCloseModalDelete = () => setShowModalDelete(false);
    const handleShowModalDelete = () => setShowModalDelete(true);

    const [modalType, setModalType] = useState<string>("None");

    const [validatedFixDiscogs, setValidatedFixDiscogs] = useState(false);
    const [fixDiscogs, setFixDiscogs] = useState<string>('');

    function clearContent() {
        setAlbuns(undefined);
        setAlbumInfo(undefined);
        setArtist(undefined);
    }

    function refreshArtists(artist: string) {
        clearContent();
        handleCloseModal();
        alert(`Artista ${artist} atualizado!`);
        setArtist({ id: artist, name: artist });
        FetchAlbums(artist).then((data) => {
            setAlbuns(data)
        });
    }

    function removeAlbum(albumInfo: AlbumData) {
        RemoveAlbum(albumInfo.id).then((_) => {
            clearContent();
            setAlbuns(undefined);
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
            clearContent();
            handleCloseModalFixDiscogs();
            FetchAlbums(albumInfo.artist).then((data) => {
                setAlbuns(data)
            });
        });

    }

    const handleSelectArtist = (item: { id: string; name: string; }) => {
        setAlbuns(undefined);
        setAlbumInfo(undefined);
        setArtist({ id: item.name, name: item.name });
        FetchAlbums(item.name).then((data) => {
            setAlbuns(data)
        });
    }

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>Gerenciador de Albuns</h2>
            <Container fluid style={
                {
                    padding: '1rem',
                    height: '95vh',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                }

            }>
                <Row>
                    <Col xs={2}>
                        <SelectArtist
                            items={Artists()}
                            handleSelectArtist={handleSelectArtist}
                            clearContent={clearContent}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button variant="success"
                            style={
                                {
                                    height: '50px',
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                    zIndex: 1000
                                }
                            }
                            onClick={
                                () => {
                                    setAlbumInfo(
                                        {
                                            id: '',
                                            title: '',
                                            artist: artist?.name as string,
                                            discogs: {
                                                cover_image: '',
                                                uri: ''
                                            },
                                            spotify: {
                                                external_urls: {
                                                    spotify: ''
                                                }
                                            }
                                        } as AlbumData
                                    );
                                    setModalType('Adicionar Album')
                                    handleShowModal();
                                }
                            }>Adicionar</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col >
                        <Discograpy
                            albuns={albuns as AlbumData[]}
                            setAlbumInfo={setAlbumInfo}
                        />
                    </Col>
                    <Col>
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

export default Home