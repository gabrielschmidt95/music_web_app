import { Alert } from 'react-bootstrap'

const ModalDelete = ({ showAlert, setShowAlert }: {
    showAlert: boolean, setShowAlert: Function
}) => {
    if (!showAlert) {
        return (
            <div></div>
        );
    }
    return (
        <Alert key="alert" variant="success" dismissible onClose={() => setShowAlert(false)}>
            Album Alterado com Sucesso
        </Alert>
    );
}

export default ModalDelete;