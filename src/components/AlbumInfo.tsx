import Album from '../models/Album'
import { Image, ListGroup, Row, Col, Container, Button, Badge } from 'react-bootstrap'
import DateTimeFormat from '../services/Utils';
import * as FaIcons from 'react-icons/fa'

const SelectArtist = ({ albumInfo, handleShowModal, setModalType, handleShowModalDelete, handleShowModalFixDiscogs }: {
    albumInfo: Album | undefined, handleShowModal: () => void,
    setModalType: (type: string) => void,
    handleShowModalDelete: () => void,
    handleShowModalFixDiscogs: () => void
}) => {
    if (albumInfo === undefined || albumInfo.title === '') {
        return (
            <Container style={
                {
                    padding: '1rem',
                    height: '80vh',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    borderRadius: '1rem'
                }
            }>
            </Container>
        );
    }
    return (
        <Container fluid style={
            {
                padding: '1rem',
                height: '80vh',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                borderRadius: '1rem',
                overflowY: 'auto',
            }
        }>
            <h1>Informações do Album</h1>
            <Row>
                <Col>
                    <Image src={albumInfo.discogs.cover_image}
                        alt='Capa do Album' thumbnail />
                    <hr />
                    <p>Discogs Fixado {albumInfo.discogs.len === 1 ? <FaIcons.FaCheckSquare></FaIcons.FaCheckSquare> : <FaIcons.FaTimes></FaIcons.FaTimes>} {albumInfo.discogs.len !== 1 ? albumInfo.discogs.len : ""}</p>
                    <p>Spotify {albumInfo.spotify.external_urls.spotify !== "" ? <FaIcons.FaCheckSquare></FaIcons.FaCheckSquare> : <FaIcons.FaTimes></FaIcons.FaTimes>}</p>
                    <hr />
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
                        <ListGroup.Item>Observação: {albumInfo.obs}</ListGroup.Item>
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
                            if (albumInfo.discogs.uri.startsWith('https://www.discogs.com/')) {
                                window.open(albumInfo.discogs.uri, '_blank')
                            } else {
                                window.open('https://www.discogs.com/release/' + albumInfo.discogs.id, '_blank')
                            }
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
                        {albumInfo.discogs.tracks ? albumInfo.discogs.tracks.map((item, idx) => (
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                                key={item.title + item.position + idx.toString()}
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
    );
}

export default SelectArtist;