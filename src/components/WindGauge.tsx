import React, { CSSProperties, useState, useEffect } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import "@fortawesome/fontawesome-free/css/all.css"
//import windImage from "../images/wind.png"

// const packeryStation = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=8775792&product=wind&datum=STND&time_zone=lst_ldt&units=english&format=json"
// const portAStation =   "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=8775241&product=wind&datum=STND&time_zone=lst_ldt&units=english&format=json"

const packeryWind = "8775792";
const portAwind = "8775241";

interface Wind {
    /* 
    degrees: example: 54.0 
    */
    d: string;
    dr: string; // direction, example: NE
    f: string; // ?? example: 0,0
    g: string; // gusts, example: 14.58 (in knots)
    s: string; // speed, example: 13.41
    t: string; // Date time string, format example: "2023-04-09 18:06"
}

const arrowColor = "blue";

function useWindStation(station){
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${station}&product=wind&datum=STND&time_zone=lst_ldt&units=english&format=json`

    const query = async () => {
        return await axios.get(url).then((result)=>{
            console.log("Station: " + station, result.data)
            if(!result.data.data){
                console.log("Missing data from buoy")
                throw Error("Missing data from buoy")
            }
            return result.data.data
        })
    }
    return useQuery({
        queryKey: [station],
        queryFn: query
    })
}

export function WindGaugePackery(){

    const wind = useWindStation(packeryWind);

    if(wind.error){
        return (<div color={"white"}>Error fetching wind data</div>)
    } else if(wind.isLoading){
        return(<div color={"white"}>Loading..</div>)
    } else if (wind.data){
        return(<WindGauge data={wind.data}/>);
    } else {
        return(<div color={"white"}>Unknown..</div>)
    }
}

export function WindGaugePortA(){

    const wind = useWindStation(portAwind);

    if(wind.error){
        return (<WindLabel><p>Error fetching data...</p></WindLabel>)
    } else if(wind.isLoading){
        return(<WindLabel><p>Loading...</p></WindLabel>);
    } else if (wind.data){
        return(<WindGauge data={wind.data}/>);
    } else {
        return(<WindLabel><p>Unknown status...</p></WindLabel>)
    }
}

function WindArrow({degrees} : {degrees: string}){
    return <i className={'fas fa-long-arrow-alt-down'} style={{fontSize: "48px", color:arrowColor, transform: `rotate(${degrees}deg)`}}/>
}

// not sure how to to type children
function WindLabel ({children}) {
    const boxStyle: CSSProperties  = {
        backgroundColor: "rgba(255,255,255,.3)",
        textAlign: "center",
        color: arrowColor,
        fontSize: "40px"
    }
    return (
        <div style={boxStyle}>
            {children}
        </div>
    )
}



/*
/* Colored Icon 
<div class="icon colored"></div>
// .colored {
//     background-color: orange; /* defines the background color of the image */
//     mask: url(https://img.icons8.com/stackoverflow) no-repeat center / contain;
//     -webkit-mask: url(https://img.icons8.com/stackoverflow) no-repeat center / contain;
//   }

// Displays Data from a NOAA Boy
export function WindGauge({data} : {data: Wind[]}){
    const lastEntry = data[data.length-1]
    const speedStyle: CSSProperties = {
        color: arrowColor,
        fontSize: "40px"
    }
    const updatedStyle: CSSProperties = {
        color: arrowColor,
        fontSize: "10px" 
    }
    console.log(lastEntry)
    const mph = Math.round(Number(lastEntry.s)* 1.150779)
    const gusts = Math.round(Number(lastEntry.g)* 1.150779)
    return (
        <WindLabel>
            <div>
                <div>
                    <span style={speedStyle}>{mph}-{gusts} mph </span><br/>
                    <span style={updatedStyle}>{lastEntry.t}</span>
                </div>
                <div>
                 <WindArrow degrees={lastEntry.d}/>
                 </div>
            </div>
        </WindLabel>
    )

}