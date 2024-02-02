import React, { useState } from 'react'
import Totals from '../services/Totals'

import TotalsData from '../models/Totals';
import { Col, Row, Container } from "react-bootstrap";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
};


const Dashboard: React.FunctionComponent = () => {
    const [totals, setTotals] = useState<TotalsData>()

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

    const pieDataLabels = Object.keys(totals ? totals.media : "")
    const pieData = {
        labels: pieDataLabels,
        datasets: [
            {
                label: 'Totais',
                data: Object.values(totals ? totals.media : ""),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Container fluid style={
        {
            padding: '3rem',
            height: '100vh',
            overflowY: 'auto',
        }
    }>
        <Row>
            <Col>
                <Pie data={pieData} options={
                    {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top' as const,
                            },
                        },
                    }
                
                }/>
            </Col>
            <Col>
                <Bar data={purchaseByYear} options={options} />
                <Bar data={releaseByYear} options={options} />
            </Col>
        </Row>
    </Container>
}

export default Dashboard