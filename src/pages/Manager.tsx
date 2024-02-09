import React, { useState } from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap';

import AlbumData from '../models/Album'

import Artists from '../services/Artists'
import { FetchAlbums, HandleAlbum, RemoveAlbum, UpdateDiscogs } from '../services/Albuns';

import SelectArtist from '../components/SelectArtists';
import AlbumInfo from '../components/AlbumInfo';
import ModalDelete from '../components/ModalDelete';
import ModalFixDiscogs from '../components/ModalFixDiscogs';
import ModalEdit from '../components/ModalEdit';
import Discograpy from '../components/Discograpy';
import Alert from '../components/Alert';

const Home: React.FunctionComponent = () => {
    const [albuns, setAlbuns] = useState<AlbumData[]>();
    const [albumInfo, setAlbumInfo] = useState<AlbumData>();
    const [artist, setArtist] = useState<{ value: string; label: string; }>();

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);


    const [showModalFixDiscogs, setShowModalFixDiscogs] = useState(false);
    const handleCloseModalFixDiscogs = () => setShowModalFixDiscogs(false);
    const handleShowModalFixDiscogs = () => setShowModalFixDiscogs(true);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleCloseModalDelete = () => setShowModalDelete(false);
    const handleShowModalDelete = () => setShowModalDelete(true);

    const [showAlert, setShowAlert] = useState(false);

    const [modalType, setModalType] = useState<string>("None");

    const [validated, setValidated] = useState(false);
    const [validatedFixDiscogs, setValidatedFixDiscogs] = useState(false);
    const [fixDiscogs, setFixDiscogs] = useState<string>('');

    const [formValues, setFormValues] = useState({
        title: '',
        artist: '',
        releaseYear: 0,
        origin: '',
        purchase: '',
        media: 'CD',
        editionYear: 0,
        ifpiMastering: '',
        ifpiMould: '',
        barcode: '',
        matriz: '',
        lote: '',
        obs: ''
    });

    function clearContent() {
        setAlbuns(undefined);
        setAlbumInfo(undefined);
        setArtist({ value: '', label: '' });
    }
    function clearForm() {
        setFormValues({
            title: '',
            artist: '',
            releaseYear: 0,
            origin: '',
            purchase: '',
            media: 'CD',
            editionYear: 0,
            ifpiMastering: '',
            ifpiMould: '',
            barcode: '',
            matriz: '',
            lote: '',
            obs: ''
        });
    }

    function removeAlbum(albumInfo: AlbumData) {
        RemoveAlbum(albumInfo.id).then((_) => {
            clearContent();
            setAlbuns(undefined);
            setAlbumInfo(undefined);
            setArtist({ value: albumInfo.artist, label: albumInfo.artist });
            handleCloseModalDelete();
            FetchAlbums(albumInfo.artist).then((data) => {
                setAlbuns(data)
            });
        });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        event.preventDefault();
        setValidated(true);

        if (formValues.artist === '' || formValues.artist === undefined || formValues.artist === null) {
            if (artist !== undefined && artist.value !== '') {
                formValues.artist = artist.value;
            } else {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        }
        HandleAlbum(formValues as AlbumData).then((data) => {
            clearContent();
            handleCloseModal();
            setArtist({ value: formValues.artist, label: formValues.artist });
            setShowAlert(true);
            FetchAlbums(formValues.artist).then((data) => {
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
        event.preventDefault();
        setValidatedFixDiscogs(true);
        UpdateDiscogs(fixDiscogs, albumInfo as AlbumData);
        clearContent();
        handleCloseModalFixDiscogs();
    }

    const handleInputChange = (title: string, event: any) => {
        setFormValues({ ...formValues, [title]: event });
    }

    const handleSelectArtist = (item: { id: string; name: string; }) => {
        setAlbuns(undefined);
        setAlbumInfo(undefined);
        setArtist(
            {
                value: item.id,
                label: item.name
            }
        );
        FetchAlbums(item.name).then((data) => {
            setAlbuns(data)
        });
    }

    return (
        <>
            <Alert showAlert={showAlert} setShowAlert={setShowAlert} />
            <h2 style={{ textAlign: 'center' }}>Gerenciador de Albuns</h2>
            <Container fluid >
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
                                    setAlbumInfo(undefined);
                                    clearForm();
                                    setModalType('Adicionar Album')
                                    handleShowModal();
                                }
                            }>Adicionar Album</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col >
                        <Discograpy
                            albuns={albuns as AlbumData[]}
                            setAlbumInfo={setAlbumInfo}
                            setFormValues={setFormValues}
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
                handleSubmit={handleSubmit}
                validated={validated}
                handleInputChange={handleInputChange}
                artist={artist}
                modalType={modalType}
            />
            <ModalFixDiscogs
                showModalFixDiscogs={showModalFixDiscogs}
                validatedFixDiscogs={validatedFixDiscogs}
                handleCloseModalFixDiscogs={handleCloseModalFixDiscogs}
                handleSubmitFixDiscogs={handleSubmitFixDiscogs}
                setFixDiscogs={setFixDiscogs}
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