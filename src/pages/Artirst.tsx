import { Card, Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Aggregate } from '../services/Albuns';
import { FaSpotify } from 'react-icons/fa';

const ArtistList: React.FunctionComponent = () => {
    const [top10Artists, setTop10Artists] = useState<any[]>()

    useEffect(() => {
        if (top10Artists === undefined || top10Artists.length === 0) {
            const query = [
                {
                    "$group": {
                        "_id": "$ARTIST",
                        "total": {
                            "$sum": 1
                        },
                        "spotify": {
                            "$first": "$SPOTIFY.artists"
                        }
                    }
                },
                {
                    "$sort": {
                        "_id": 1
                    }
                }
            ]

            Aggregate(query).then((data) => {
                setTop10Artists(data)
            })

        }
    }, [top10Artists])

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Artistas</h1>

            <Container fluid
                style={
                    {
                        padding: '1rem',
                        height: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        borderRadius: '1rem'
                    }
                }>
                <Row>
                    {
                        top10Artists?.map((artist, _) => {
                            return (
                                    <Col key={artist._id} style={{ padding: '1rem' }}>
                                        <Card
                                            style={
                                                {
                                                    height: '15rem',
                                                    width: '16rem',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    borderRadius: '1rem'
                                                }
                                            }
                                        >
                                            <Card.Body>
                                                <Card.Title>{artist._id}</Card.Title>
                                                <Card.Text>
                                                    Quantidade de álbuns: {artist.total}
                                                </Card.Text>
                                                {
                                                    artist.spotify ? artist.spotify.map((spotify: Record<string, any>) => {
                                                        return <Col key={spotify.external_urls.spotify}>
                                                            <Card.Link href={spotify.external_urls.spotify} target="_blank"
                                                                style={
                                                                    {
                                                                        bottom: '1rem',
                                                                        color: 'green',
                                                                        display: artist.spotify ? 'block' : 'none'
                                                                    }
                                                                }>
                                                                <FaSpotify /> {spotify.name}
                                                            </Card.Link>
                                                        </Col>
                                                    }) : <> </>
                                                }
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                    }
                </Row>
            </Container>
        </>
    )
}

export default ArtistList