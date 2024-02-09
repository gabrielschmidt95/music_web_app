import Album from '../models/Album'
import { Modal, Button } from 'react-bootstrap'

const ModalDelete = ({ albumInfo, showModalDelete, handleCloseModalDelete, removeAlbum }: {
    albumInfo: Album,
    showModalDelete: boolean, handleCloseModalDelete: () => void, removeAlbum: (album: Album) => void

}) => {

    return (
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
                        removeAlbum(albumInfo)
                    }
                }>Deletar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDelete;