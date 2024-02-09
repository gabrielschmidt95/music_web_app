import { Modal, Button, Form } from 'react-bootstrap'

const ModalDelete = ({ showModalFixDiscogs, validatedFixDiscogs, handleCloseModalFixDiscogs, handleSubmitFixDiscogs, setFixDiscogs }: {
    showModalFixDiscogs: boolean, validatedFixDiscogs: boolean, handleCloseModalFixDiscogs: () => void,
    handleSubmitFixDiscogs: (event: React.FormEvent<HTMLFormElement>) => void, setFixDiscogs: (value: string) => void

}) => {

    return (
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
    );
}

export default ModalDelete;