import { Modal, Button, Form } from 'react-bootstrap'
import { useState } from 'react';
import AlbumData from '../models/Album';
import Artists from '../services/Artists'
import { HandleAlbum } from '../services/Albuns';

const ModalDelete = ({ showModal, modalType, albumInfo, handleCloseModal, refreshArtists }: {
    modalType: string, albumInfo: AlbumData,
    showModal: boolean, handleCloseModal: () => void,
    refreshArtists?: (artist: string) => void
}) => {
    const [setFieldsNA, setSetFieldsNA] = useState(false);
    const [newArtist, setNewArtist] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleInputChange = (title: string, event: any) => {
        setFormValues({ ...formValues, [title]: event });
    }

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(false);
            return;
        }
        event.preventDefault();
        setValidated(true);

        if (formValues.artist === '' || formValues.artist === undefined || formValues.artist === null) {
            if (albumInfo.artist === '' || albumInfo.artist === undefined || albumInfo.artist === null) {
                setValidated(false);
                return;
            }
            formValues.artist = albumInfo.artist;
        }

        HandleAlbum(formValues as AlbumData).then((_) => {
            handleCloseModal();
            if (refreshArtists !== undefined) {
                refreshArtists(formValues.artist);
            }
        });
    }

    return (
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
                                (e) => handleInputChange('title', e.target.value.toUpperCase())
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editForm.ControlInput2">
                        <Form.Label>Artista</Form.Label>
                        <Form.Control
                            style={
                                {
                                    display: newArtist ? 'block' : 'none'
                                }
                            }
                            placeholder='Novo Artista'
                            type="text"
                            onChange={
                                (e) => handleInputChange('artist', e.target.value.toUpperCase())
                            }
                        />
                        <Form.Select aria-label="Default select example"
                            style={
                                {
                                    display: newArtist ? 'none' : 'block'
                                }
                            }
                            onChange={
                                (e) => handleInputChange('artist', e.target.value)
                            }
                            defaultValue={albumInfo?.artist}
                        >
                            <option value={""}>Selecione o Artista</option>
                            {Artists().map((item, _) => (
                                <option key={item.name}>{item.name}</option>
                            ))}
                        </Form.Select>

                        <Form.Check
                            type="checkbox"
                            id="editForm.ControlInput2"
                            label="Novo Artista"
                            onChange={
                                (e) => {
                                    if (e.target.checked) {
                                        setNewArtist(true);
                                    } else {
                                        setNewArtist(false);
                                    }
                                }
                            }
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
                            required
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
                                (e) => {
                                    handleInputChange('media', e.target.value)
                                    if (e.target.value.startsWith('VINIL')) {
                                        setSetFieldsNA(true);
                                    } else {
                                        setSetFieldsNA(false);
                                    }
                                }
                            }
                            defaultValue={albumInfo?.media}
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
                            defaultValue={setFieldsNA ? "NA" : albumInfo?.ifpiMastering}
                            onChange={
                                (e) => handleInputChange('ifpiMastering', e.target.value)
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editForm.ControlInput9">
                        <Form.Label>IFPI Mould</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={setFieldsNA ? "NA" : albumInfo?.ifpiMould}
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
                            as="textarea"
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
                            defaultValue={setFieldsNA ? "NA" : albumInfo?.lote}
                            onChange={
                                (e) => handleInputChange('lote', e.target.value)
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="editForm.ControlInput12">
                        <Form.Label>Observação</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={setFieldsNA ? "NA" : albumInfo?.obs}
                            onChange={
                                (e) => handleInputChange('obs', e.target.value)
                            }
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalDelete;