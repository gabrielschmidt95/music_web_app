import React, { useState } from 'react'
import Select from 'react-select'
import { Row, Col, Container, Card, ListGroup, Badge, Button, Modal, Form, Alert, Image } from 'react-bootstrap';

import AlbumData from '../models/Album'
import Artists from '../services/Artists'
import { FetchAlbums, HandleAlbum, RemoveAlbum, UpdateDiscogs } from '../services/Albuns';
import DateTimeFormat from '../services/Utils';

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
        lote: ''
    });

    function clearContent() {
        setAlbuns(undefined);
        setAlbumInfo(undefined);
        setArtist({ value: '', label: '' });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();
        setValidated(true);
        HandleAlbum(formValues as AlbumData);
        clearContent();
        handleCloseModal();
        setShowAlert(true);
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

    return (
        <>
            {
                showAlert ?
                    <Alert key="alert" variant="success" dismissible onClose={() => setShowAlert(false)}>
                        Album Alterado com Sucesso
                    </Alert>
                    : ''
            }

            <Container fluid >
                <Row>
                    <Col xs={2}>
                        <Select options={Artists()} onChange={
                            (e) => {
                                if (e?.value) {
                                    setAlbuns(undefined);
                                    setAlbumInfo(undefined);
                                    setArtist(
                                        {
                                            value: e.value,
                                            label: e.value
                                        }
                                    );
                                    FetchAlbums(e.value).then((data) => {
                                        setAlbuns(data)
                                    });
                                }
                            }
                        }
                            placeholder="Selecione o artista"
                            value={artist}
                        />
                    </Col>
                    <Col xs={2}>
                        <Button variant="success" onClick={
                            () => {
                                setAlbumInfo(undefined);
                                handleShowModal();
                                setModalType('Adicionar Album')
                            }
                        }>Adicionar Album</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col >
                        {albuns ?
                            <Container style={
                                {
                                    padding: '1rem',
                                    height: '90vh',
                                    overflowY: 'auto',
                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
                                }
                            }>
                                <Row>
                                    {albuns.map((item, _) => (
                                        <Col key={item.id} style={{ padding: '1rem' }}>
                                            <Card style={{ width: '20rem', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }} key={item.id} onClick={
                                                () => {
                                                    console.log(item.id)
                                                    setAlbumInfo(item)
                                                    setFormValues(item)
                                                }
                                            }>
                                                <Card.Img variant="top" src={item.discogs.cover_image} style={{ width: '18rem', height: '18rem', paddingLeft: '1rem', paddingTop: '1rem' }} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{item.artist}</Card.Subtitle>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Container> : ''}

                    </Col>
                    <Col>
                        {albumInfo ?
                            <Container style={
                                {
                                    padding: '1rem',
                                    height: '90vh',
                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
                                }
                            }>
                                <h1>Informações do Album</h1>
                                <Row>
                                    <Col>
                                        <Image src={albumInfo.discogs.cover_image}
                                            alt='Capa do Album' thumbnail />
                                    </Col>
                                    <Col>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>Ano: {albumInfo.releaseYear}</ListGroup.Item>
                                            <ListGroup.Item>Artista: {albumInfo.artist}</ListGroup.Item>
                                            <ListGroup.Item>Título: {albumInfo.title}</ListGroup.Item>
                                            <ListGroup.Item>Mídia: {albumInfo.media}</ListGroup.Item>
                                            <ListGroup.Item>Compra: {
                                                DateTimeFormat(albumInfo.purchase)
                                            }</ListGroup.Item>
                                            <ListGroup.Item>Origem: {albumInfo.origin}</ListGroup.Item>
                                            <ListGroup.Item>Ano de Edição: {albumInfo.editionYear}</ListGroup.Item>
                                            <ListGroup.Item>IFPI Mastering: {albumInfo.ifpiMastering}</ListGroup.Item>
                                            <ListGroup.Item>IFPI Mould: {albumInfo.ifpiMould}</ListGroup.Item>
                                            <ListGroup.Item>Barcode: {albumInfo.barcode}</ListGroup.Item>
                                            <ListGroup.Item>Matriz: {albumInfo.matriz}</ListGroup.Item>
                                            <ListGroup.Item>Lote: {albumInfo.lote}</ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>

                                <br />
                                <Row>
                                    <Col>
                                        <Button variant="success" onClick={
                                            () => {
                                                window.open(albumInfo.spotify.external_urls.spotify, '_blank')
                                            }

                                        }
                                            disabled={albumInfo.spotify.external_urls.spotify === ''}
                                        >Spotify</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="dark" onClick={
                                            () => {
                                                window.open(albumInfo.discogs.uri, '_blank')
                                            }

                                        }
                                            disabled={albumInfo.discogs.uri === ''}
                                        >Discogs</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="primary" onClick={
                                            () => {
                                                handleShowModal();
                                                setModalType('Editar Album')
                                            }
                                        }>
                                            Editar
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="danger" onClick={
                                            () => {
                                                handleShowModalDelete();
                                            }
                                        }>
                                            Deletar
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="danger"
                                            onClick={
                                                () => {
                                                    handleShowModalFixDiscogs();
                                                }
                                            }
                                        >
                                            Fix Dicogs
                                        </Button>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <h2>Lista de Músicas</h2>
                                        <ListGroup as="ol" numbered style={
                                            {
                                                padding: '1rem',
                                                border: '1px solid #000',
                                                height: '30vh',
                                                overflowY: 'auto',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
                                            }

                                        }>
                                            {albumInfo.discogs.tracks ? albumInfo.discogs.tracks.map((item, _) => (
                                                <ListGroup.Item
                                                    as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                    key={item.title}
                                                >
                                                    <div className="ms-2 me-auto">
                                                        <div className="fw-bold">{item.title}</div>
                                                    </div>
                                                    <Badge bg="primary" pill>
                                                        {item.duration}
                                                    </Badge>
                                                </ListGroup.Item>
                                            )) : ''}
                                        </ListGroup>
                                    </Col>
                                </Row>

                            </Container>
                            : ''}
                    </Col>
                </Row>
            </Container>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Form validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput1">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={albumInfo?.title}
                                autoFocus
                                onChange={
                                    (e) => handleInputChange('title', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput2">
                            <Form.Label>Artista</Form.Label>
                            <Select options={Artists()}
                                onChange={
                                    (e) => e ? handleInputChange('artist', e?.value) : ''
                                }
                                defaultValue={artist}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput3">
                            <Form.Label>Ano</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                defaultValue={albumInfo?.releaseYear}
                                onChange={
                                    (e) => handleInputChange('releaseYear', parseInt(e.target.value))
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput4">
                            <Form.Label>Origem</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={albumInfo?.origin}
                                onChange={
                                    (e) => handleInputChange('origin', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput5">
                            <Form.Label>Compra</Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={albumInfo?.purchase ? albumInfo.purchase.split('T')[0] : ''}
                                onChange={
                                    (e) => handleInputChange('purchase', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput6">
                            <Form.Label>Mídia</Form.Label>
                            <Form.Select required aria-label="Default select example"
                                onChange={
                                    (e) => handleInputChange('media', e.target.value)
                                }
                            >
                                <option>CD</option>
                                <option>COMPACTO</option>
                                <option>VINIL</option>
                                <option>VINIL &gt; CD</option>
                                <option>VINIL &gt; MP3</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput7">
                            <Form.Label>Ano de Edição</Form.Label>
                            <Form.Control
                                type="number"
                                defaultValue={albumInfo?.editionYear}
                                onChange={
                                    (e) => handleInputChange('editionYear', parseInt(e.target.value))
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput8">
                            <Form.Label>IFPI Mastering</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={albumInfo?.ifpiMastering}
                                onChange={
                                    (e) => handleInputChange('ifpiMastering', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput9">
                            <Form.Label>IFPI Mould</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={albumInfo?.ifpiMould}
                                onChange={
                                    (e) => handleInputChange('ifpiMould', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput10">
                            <Form.Label>Barcode</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={albumInfo?.barcode}
                                onChange={
                                    (e) => handleInputChange('barcode', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput11">
                            <Form.Label>Matriz</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={albumInfo?.matriz}
                                onChange={
                                    (e) => handleInputChange('matriz', e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editForm.ControlInput12">
                            <Form.Label>Lote</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={albumInfo?.lote}
                                onChange={
                                    (e) => handleInputChange('lote', e.target.value)
                                }
                            />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Salvar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showModalFixDiscogs} onHide={handleCloseModalFixDiscogs}>
                <Form validated={validatedFixDiscogs} onSubmit={handleSubmitFixDiscogs}>
                    <Modal.Header closeButton>
                        <Modal.Title>Fix Discogs</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="fixDiscogs.ControlInput1">
                            <Form.Label>Entre com Codigo de identificação [r...]</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={
                                    (e) => setFixDiscogs(e.target.value)
                                }
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Deletar Album</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza que deseja deletar o album {albumInfo?.title} de {albumInfo?.artist}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={
                        () => {
                            if (albumInfo)
                                RemoveAlbum(albumInfo.id);
                            setAlbuns(undefined);
                            setAlbumInfo(undefined);
                            setArtist({ value: '', label: '' });
                            handleCloseModalDelete();
                        }
                    }>Deletar</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Home