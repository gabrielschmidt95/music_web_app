import { Container, Row, Col, Card } from 'react-bootstrap'
import AlbumData from '../models/Album'

const ModalDelete = ({ albuns, setAlbumInfo, setFormValues }: {
    albuns: AlbumData[],
    setAlbumInfo: Function,
    setFormValues: Function
}) => {
    if (albuns === undefined) {
        return (
            <Container style={
                {
                    padding: '1rem',
                    height: '85vh',
                }
            }>
            </Container>
        );
    }
    return (
        <Container style={
            {
                padding: '1rem',
                height: '85vh',
                overflowY: 'auto',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                borderRadius: '1rem'
            }
        }>
            <Row md="auto">
                {albuns.map((item, _) => (
                    <Col key={item.id} style={{ padding: '1rem' }}>
                        <Card style={
                            {
                                width: '20rem',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                borderRadius: '1rem',
                            }
                        }
                            key={item.id}
                            onClick={
                                () => {
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
        </Container>
    );
}

export default ModalDelete;