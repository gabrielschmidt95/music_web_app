import React, { useState } from 'react'
import Totals from '../services/Totals'

import TotalsData from '../models/Totals';
import { Col, Row, Container, Table, Modal } from "react-bootstrap";
import { FetchAlbumsByYearMetric } from '../services/Albuns';

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
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Media</th>
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
                                        }) : <></>
                                    }
                                </tbody>
                            </Table>
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
                    <Modal.Title>{modalYear}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                            <tr>
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
                                        return <tr key={album.title}>
                                            <td>{album.artist}</td>
                                            <td>{album.title}</td>
                                            <td>{album.media}</td>
                                            <td>{album.purchase ? album.purchase.split("-")[2] + "/" + album.purchase.split("-")[1] + "/" + album.purchase.split("-")[0] : ""}</td>
                                        </tr>
                                    }) : <></>
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Dashboard