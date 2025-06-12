import React from "react"
import {Table} from "antd"
import { ProcessedWaveData, useWaveStationCC, windDirectionToDegrees } from "../queries/WaveQueries";

export function WaveInfo42020 ({count}:{count: number}){
    const waveData = useWaveStationCC();
    
    if(!waveData.data){
        if(waveData.isLoading){
            return(<div>Loading..</div>)
        } else {
            return(<div>Error?..</div>)
        }
    }
    return(<WaveInfo data={waveData.data} count={count}/>)
    
}

const renderFeet = (v) => `${v} ft`

function renderSummaryInfo(text, record: ProcessedWaveData, indexarams){
    const waveHeight = renderFeet(record.sigWaveHeight)
    const waveDegrees = record.medianDirection
    const wavePeriod = record.averagePeriod
    return (<>
    {waveHeight} @ {wavePeriod} <WaveArrow degrees={waveDegrees}/>
    </> 
    )
}
function renderSwellInfo(text, record: ProcessedWaveData, indexarams){
    const waveHeight = renderFeet(record.swellWaveHeight)
    const waveDegrees = record.swellDirection
    const wavePeriod = record.swellPeriod
    return (<>
    {waveHeight} @ {wavePeriod} <WaveArrow degrees={waveDegrees}/>
    </> 
    )
}

function renderWindWaveInfo(text, record: ProcessedWaveData, indexarams){
    const waveHeight = renderFeet(record.windWaveHeight)
    const waveDegrees = record.windWaveDirection
    const wavePeriod = record.windWavePeriod
    return (<>
    {waveHeight} @ {wavePeriod} <WaveArrow degrees={waveDegrees}/>
    </> 
    )
}

function WaveInfo ({data, count} : {data: ProcessedWaveData[], count: number}){

    const requiredData = data.slice(0, count)
    const columns = [
        {
            title: 'Date',
            dataIndex: 'dateTime',
        },
        {
            title: 'Averages',
            dataIndex: 'sigWaveHeight',
            render: renderSummaryInfo
        },
        {
            title: 'Swell',
            dataIndex: 'swellWaveHeight',
            render: renderSwellInfo
        },        
        {
            title: 'Wind',
            dataIndex: 'windWaveHeight',
            render: renderWindWaveInfo
        }       
    ]

    return (
    <div style={{alignContent: "center"}}>
        <Table columns={columns} dataSource={requiredData} pagination={false}/>        
    </div>)
}

function WaveArrow({degrees} : {degrees: number}){
    return <i className={'fas fa-long-arrow-alt-down'} style={{fontSize: "24px", color:"blue", padding: "5px", transform: `rotate(${degrees}deg)`}}/>
}
