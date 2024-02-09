import { Modal, Row, Col, Table, Spinner } from 'react-bootstrap'
import { FaRecordVinyl, FaCompactDisc } from 'react-icons/fa'

const ModalAlbum = ({ modalValue, showModal, modalYear, handleCloseModal }: {
    modalValue: Record<string, string>[] | undefined,
    showModal: boolean,
    modalYear: string,
    handleCloseModal: () => void,

}) => {
    if (modalValue === undefined) {
        return (
            <></>
        );
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="xl" >
            <Modal.Header closeButton>
                <Modal.Title>
                    <Row>
                        <Col>
                            <h1>Albums de {modalYear}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Total: {modalValue ? modalValue.length : 0}</h2>
                        </Col>
                    </Row>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Artista</th>
                            <th>Album</th>
                            <th>Media</th>
                            <th>Data de Compra</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            modalValue ?
                                modalValue.map((album, _) => {
                                    return <tr key={album.title + album.purchase}>
                                        {
                                            album.media.startsWith('VINIL') ? <td><FaRecordVinyl color='black' /></td> : <td><FaCompactDisc color='grey' /></td>
                                        }
                                        <td>{album.artist}</td>
                                        <td>{album.release ? album.release + " - " + album.title : album.title}</td>
                                        <td>{album.media}</td>
                                        <td>{album.purchase ? album.purchase.split("-")[2] + "/" + album.purchase.split("-")[1] + "/" + album.purchase.split("-")[0] : ""}</td>
                                    </tr>
                                }) : <tr><td><Spinner animation="border" /></td></tr>
                        }
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                Vinil: <FaRecordVinyl color='black' /> CD: <FaCompactDisc color='grey' />
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAlbum;