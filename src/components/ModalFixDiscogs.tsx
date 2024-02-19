import { Modal, Button, Form, Container, Row, Col, Card } from 'react-bootstrap'
import AlbumData from '../models/Album'
import { useState } from 'react'
import { GetDiscogs } from '../services/Discogs'
import DiscogsData from '../models/Discogs';

const ModalDelete = ({ showModalFixDiscogs, validatedFixDiscogs, handleCloseModalFixDiscogs, handleSubmitFixDiscogs, setFixDiscogs, albumInfo }: {
    showModalFixDiscogs: boolean, validatedFixDiscogs: boolean, handleCloseModalFixDiscogs: () => void,
    handleSubmitFixDiscogs: (event: React.FormEvent<HTMLFormElement>) => void, setFixDiscogs: (value: string) => void
    albumInfo: AlbumData

}) => {
    const [discogsData, setDiscogsData] = useState<DiscogsData[]>();
    if (albumInfo === undefined || showModalFixDiscogs === false) {
        if (discogsData && discogsData.length > 0) setDiscogsData([]);
        return <></>;
    }
    if (discogsData === undefined) {
        GetDiscogs(albumInfo).then((data) => {
            setDiscogsData(data);
        });
    }

    return (
        <Modal show={showModalFixDiscogs} onHide={handleCloseModalFixDiscogs} size="xl">
            <Form validated={validatedFixDiscogs} onSubmit={handleSubmitFixDiscogs}>
                <Modal.Header closeButton>
                    <Modal.Title>Fix Discogs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2" controlId="fixDiscogs.ControlInput1">
                        <Form.Label>Entre com Codigo de identificação [r...]</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={
                                (e) => setFixDiscogs(e.target.value)
                            }
                        />
                    </Form.Group>
                    <hr />
                    <Form.Label>Ou Escolha uma das opções abaixo</Form.Label>
                    <Container
                        style={
                            {
                                maxHeight: '40vh',
                                overflow: 'auto',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            }
                        }
                    >
                        <Row>
                            {discogsData ? discogsData.map((item, index) => (
                                <Col key={item.id} xs={2} style={
                                    {
                                        padding: '1rem',
                                        height: '100%',
                                        borderRadius: '1rem',
                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                        margin: '1rem',
                                    }

                                }>
                                    <Card style={{ width: '10rem' }}>
                                        <Card.Img variant="top" src={item.thumb} style={
                                            {
                                                height: '10rem',
                                                width: '10rem',
                                                objectFit: 'cover'
                                            }

                                        } />
                                        <Card.Body>
                                            <Card.Title>{item.title.substring(0, 20)}</Card.Title>
                                            <Button variant="info" onClick={() => {
                                                window.open('https://www.discogs.com' + item.uri, '_blank')
                                            }}>{item.id}</Button>
                                            <hr />
                                            <Button variant="primary" type="submit" onClick={
                                                () => {
                                                    setFixDiscogs(item.id.toString());
                                                }

                                            }>Escolher</Button>
                                        </Card.Body>
                                        <Card.Footer>
                                            <br />
                                            <ul>
                                                <li key={item.format[0]} className="text-muted">{item.format[0]}</li>
                                                <li key={item.country} className="text-muted">{item.country}</li>
                                            </ul>

                                        </Card.Footer>
                                    </Card>
                                </Col>
                            )) : <></>}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalDelete;