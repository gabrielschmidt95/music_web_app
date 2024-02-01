import React from 'react'
import styled from 'styled-components'

const DashboardText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    height: 70vh;
`

const Dashboard: React.FunctionComponent = () => {
    return (
        <DashboardText>Dashboard</DashboardText>
    )
}

export default Dashboard