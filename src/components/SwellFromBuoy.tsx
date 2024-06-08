import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import axios from "axios"
import { Table } from "antd";
import "@fortawesome/fontawesome-free/css/all.css"

const buoy42020 = "https://www.ndbc.noaa.gov/data/realtime2/42020.spec"
const corsProxy = "https://corsproxy.io/?"
// const corsProxy = "https://cors-proxy.htmldriven.com/?url="
const buoy4020withCORS = corsProxy+buoy42020

/* Example data
#YY  MM DD hh mm WVHT  SwH  SwP  WWH  WWP SwD WWD  STEEPNESS  APD MWD
#yr  mo dy hr mn    m    m  sec    m  sec  -  degT     -      sec degT
2023 04 13 00 40  1.7  1.6  9.1  0.7  4.0 ENE NNE    AVERAGE  5.8  77
2023 04 13 00 10  1.9  1.7  9.1  0.7  4.5 ENE  NE    AVERAGE  6.0  72
2023 04 12 23 40  1.7  1.5  9.1  0.8  4.0 ENE  NE    AVERAGE  5.6  73
2023 04 12 23 10  1.9  1.7  9.1  0.9  5.0 ENE  NE    AVERAGE  5.8  76
*/

interface BouyData {
    YY: string,
    MM: string,
    DD: string,
    hh: string,
    mm: string,    
    WVHT: string,
    SwH: string,
    SwP: string,
    WWH: string,
    SwD: string,
    WWD: string,
    APD: string,
    MWD: string,
}

interface ProcessedBuoyData {
    dateTime: string,
    sigWaveHeight: number
    swellWaveHeight: number,
    windWaveHeight: number,
    averagePeriod: number,
    medianDirection: string
}

const arrowColor = "blue";

function WaveArrow({degrees} : {degrees: string}){
    return <i className={'fas fa-long-arrow-alt-down'} style={{fontSize: "24px", color:arrowColor, transform: `rotate(${degrees}deg)`}}/>
}

function metersToFeet(meters) : number {
    return Math.round(meters*3.28084*10)/10
}

function textBlockToListOfObjects(textBlock) {
    // Split the text block into lines
    const lines = textBlock.trim().split('\n');

    // Split the first line into headers
    const headers = lines[0].split(' ').filter((a)=>a!==''); // Assuming tab-separated values

    // Initialize an array to hold the resulting objects
    const result: BouyData[] = [];

    // Iterate over each subsequent line, but skip lines 0 and 1 as they were the headers
    for (let i = 2; i < lines.length; i++) {
        // Split the line into values
        const values = lines[i].split(' ').filter((a)=>a!=='')
        // Create an object for the current line
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j];
        }
        
        // Add the object to the result array
        result.push(obj as BouyData);
    }

    return result;
}

function useWaveStation(station){
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${station}.spec`
    const urlWithProxy = corsProxy+url
    const latest = new Date().getTime()
    const urlUnique = urlWithProxy + "?" + latest
    axios.defaults.headers.get = {
        //"Cache-Control": "no-cache",        
        //'Expires': '0',
    }
    const query = async () => {
        return await axios.get(urlUnique,{
            params: {
                _ts: new Date().getTime() // Add a unique timestamp to the request URL to prevent caching
            }
        }).then((result)=>{
            console.log(result.data)
            const csv = textBlockToListOfObjects(result.data)
            console.log(csv)
            return csv
        })
    }
    return useQuery({
        queryKey: [station],
        queryFn: query
    })
}

async function fetchUrl(url){
    let response = await fetch(buoy42020, {
        credentials: "omit",
        mode: "no-cors"            
    })
    let data = await response.text()
    return data
}

export function WaveInfo42020 (){
    const waveData = useWaveStation("42020");
    // useEffect(()=>{
    //     axios.get(buoy42020, {
    //         headers: {
    //             'Content-Type': 'text/html',
    //             'Access-Control-Allow-Origin': '*',
    //             'Access-Control-Allow-Methods':'GET',
    //           },
    //         withCredentials: false,
    //     }).then((result)=>{
    //         console.log(result.data)
    //         setWaveData(result.data.data)
    //     }).catch((error)=>{
    //         console.log(error)
    //     })
    // },[])
    // useEffect(()=>{
    //     fetchUrl(buoy42020).then((data)=>{
    //         console.log("Data", data)
    //     }).catch((error)=>{
    //         console.log("Error", error)
    //     })
    // }, [])
    
    if(!waveData.data){
        if(waveData.isLoading){
            return(<div>Loading..</div>)
        } else {
            return(<div>Error?..</div>)
        }
    } else {
        return(<WaveInfo data={waveData.data}/>)
    }
    
}

/** Takes a time string in the form Month:Day hour:minute and converts it from GMT to central
 * 
 */
function convertGMTToCT(gmtString) {
    const isoDateString = new Date(gmtString).toISOString();

    // Parse the date string
    const gmtDate = new Date(isoDateString);

    if (!gmtDate) {
        throw new Error('Invalid date string');
    }

    // Get the offset in minutes between GMT and CT
    const ctOffset = -360; // CDT is UTC-5
    const cdtOffset = -300; // CST is UTC-6

    // Check if Daylight Saving Time is in effect
    const isDST = (gmtDate.toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'short' }).includes('CDT'));
    console.log("isDST", isDST)
    const offset = isDST ? cdtOffset : ctOffset;

    // Apply the offset to convert GMT to CT
    const ctDate = new Date(gmtDate.getTime() + offset * 60 * 1000);

    // Extract the month, day, hour, and minute
    const month = String(ctDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(ctDate.getUTCDate()).padStart(2, '0');
    const hours = String(ctDate.getUTCHours()).padStart(2, '0');
    const minutes = String(ctDate.getUTCMinutes()).padStart(2, '0');

    // Format the output string
    return `${month}-${day} ${hours}:${minutes}`;
}

function WaveInfo ({data} : {data:BouyData[]}){

    const requiredData: ProcessedBuoyData[] = data.slice(0, 5).map((row)=>{
        return {
            dateTime: convertGMTToCT(`${row.YY}-${row.MM}-${row.DD} ${row.hh}:${row.mm}:00.000`),
            sigWaveHeight: metersToFeet(Number(row.WVHT)),
            swellWaveHeight: metersToFeet(Number(row.SwH)),
            windWaveHeight: metersToFeet(Number(row.WWH)),
            averagePeriod: Number(row.APD),
            medianDirection: row.MWD,
        }
    })
    const renderFeet = (v) => `${v} ft`
    const columns = [
        {
            title: 'Date',
            dataIndex: 'dateTime',
        },
        {
            title: 'Wave',
            dataIndex: 'sigWaveHeight',
            render: renderFeet
        },
        {
            title: 'SwellH',
            dataIndex: 'swellWaveHeight',
            render: renderFeet
        },        
        {
            title: 'WindH',
            dataIndex: 'windWaveHeight',
            render: renderFeet
        }, 
        {
            title: 'Period',
            dataIndex: 'averagePeriod',
        },
        {
            title: 'Direction',
            dataIndex: 'medianDirection',
            render: (direction) => {
                return (<WaveArrow degrees={direction}/>)
            }
        },          
    ]

    return (
    <div style={{alignContent: "center"}}>
        <Table columns={columns} dataSource={requiredData}/>        
    </div>)
}