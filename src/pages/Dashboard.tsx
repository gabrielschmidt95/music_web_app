import React, { useState } from 'react'
import Totals from '../services/Totals'

import TotalsData from '../models/Totals';
import { Col, Row, Container, Table, Modal, Spinner } from "react-bootstrap";
import { Aggregate, FetchAlbumsByYearMetric, FetchAlbums } from '../services/Albuns';

import { FaRecordVinyl, FaCompactDisc } from "react-icons/fa";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard: React.FunctionComponent = () => {
    const [totals, setTotals] = useState<TotalsData>()
    const [top10Artists, setTop10Artists] = useState<Record<string, number | string>[]>()

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [modalValue, setModalValue] = useState<Record<string, string>[]>()
    const [modalYear, setModalYear] = useState<number>()

    if (totals === undefined) {
        Totals().then((data) => {
            setTotals(data)
        })
    }
    if (top10Artists === undefined) {
        const query = [
            {
                "$group": {
                    "_id": "$ARTIST",
                    "total": {
                        "$sum": 1
                    }
                }
            },
            {
                "$sort": {
                    "total": -1
                }
            },
            { "$limit": 20 }
        ]

        Aggregate(query).then((data) => {
            setTop10Artists(data)
        })

    }
    const purchaseByYearLabels = Object.keys(totals ? totals.buy : "")
    const purchaseByYear = {
        purchaseByYearLabels,
        datasets: [
            {
                label: 'Compas Por Ano',
                data: totals?.buy,
                backgroundColor: 'blue',
            }
        ],
    };

    const releaseByYearLabels = Object.keys(totals ? totals.year : "")
    const releaseByYear = {
        releaseByYearLabels,
        datasets: [
            {
                label: 'Ano de lançamento',
                data: totals?.year,
                backgroundColor: 'green',
            }
        ],
    };

    const top10ArtistsLabels = top10Artists ? top10Artists.map((artist, _) => artist._id as string) : []
    const top10ArtistsData = top10Artists ? top10Artists.map((artist, _) => artist.total) : []

    return (
        <>
            <Container fluid style={
                {
                    padding: '2rem',
                    height: '100vh',
                    overflowY: 'auto',
                }
            }>
                <Col>
                    <Row>
                        <Col>
                            <h1>Dashboard</h1>
                        </Col>
                    </Row>
                    <Row
                        style={
                            {
                                padding: '2rem',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                borderRadius: '1rem',
                            }
                        }
                    >
                        <Col xs={5}>
                            <h2>Quantitativo por Mídia</h2>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Mídia</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        totals ? Object.keys(totals.media).map(key => {
                                            return <tr key={key}>
                                                <td>{key}</td>
                                                <td>{totals.media[key]}</td>
                                            </tr>
                                        }) : <tr><td><Spinner animation="border" /></td></tr>
                                    }
                                </tbody>
                            </Table>
                        </Col>
                        <Col xs={5}>
                            <h2>Top 20 Albuns por Artista</h2>
                            <Bar data={{
                                labels: top10ArtistsLabels,
                                datasets: [
                                    {
                                        label: 'Top 20',
                                        data: top10ArtistsData,
                                        backgroundColor: 'red',
                                    }
                                ],
                            }} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top' as const,
                                    },
                                },
                                onClick: (evt: any, item: any) => {
                                    if (item[0] !== undefined) {
                                        const artist = top10ArtistsLabels[item[0].index]
                                        console.log(artist)
                                        FetchAlbums(artist).then((data) => {
                                            //setModalYear(parseInt(year))
                                            let albumData: Record<string, string>[] = []
                                            data.map((album, _) => {
                                                albumData.push({
                                                    "title": album.title,
                                                    "artist": album.artist,
                                                    "media": album.media,
                                                    "purchase": album.purchase ? album.purchase.split("T")[0] : "",
                                                    "release": album.releaseYear.toString()
                                                })
                                            })
                                            setModalValue(albumData)
                                            handleShowModal()
                                        })

                                    }
                                }
                            }} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col
                            style={{
                                padding: '2rem',
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                borderRadius: '1rem',
                            }}
                        >
                            <h2>Compras por Ano</h2>
                            <Bar data={purchaseByYear} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top' as const,
                                    },
                                },
                                onClick: (evt: any, item: any) => {
                                    if (item[0] !== undefined) {
                                        const year = Object.keys(purchaseByYear.datasets[0].data!)[item[0].index]
                                        FetchAlbumsByYearMetric(parseInt(year), "purchase").then((data) => {
                                            setModalYear(parseInt(year))
                                            setModalValue(data)
                                            handleShowModal()
                                        })

                                    }
                                }
                            }} />
                        </Col>

                        <Col
                            style={
                                {
                                    padding: '2rem',
                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                    borderRadius: '1rem',
                                }
                            }
                        >
                            <h2>Lançamentos por Ano</h2>
                            <Bar data={releaseByYear} options={
                                {
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top' as const,
                                        },
                                    },
                                    onClick: (evt: any, item: any) => {
                                        if (item[0] !== undefined) {
                                            const year = Object.keys(releaseByYear.datasets[0].data!)[item[0].index]
                                            FetchAlbumsByYearMetric(parseInt(year), "release_year").then((data) => {
                                                setModalYear(parseInt(year))
                                                setModalValue(data)
                                                handleShowModal()
                                            })

                                        }
                                    }
                                }
                            } />
                        </Col>
                    </Row>
                </Col>
            </Container>
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
                                            <td>{album.release ? album.release + " - " + album.title: album.title}</td>
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
        </>
    )
}

export default Dashboard