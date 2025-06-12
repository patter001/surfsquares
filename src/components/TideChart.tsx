import axios from "axios";
import React, {useState, useEffect, useMemo} from "react"
import { Component } from "react/cjs/react.development";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTideData } from "../queries/TideQueries";

// Tide interactive chart:
// https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8775870&units=standard&bdate=20220810&edate=20220811&timezone=LST/LDT&clock=24hour&datum=MLLW&interval=30&action=dailychart

//https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=20220820&end_date=20220823&datum=MLLW&station=8775870&time_zone=lst_ldt&units=english&interval=30&format=json

//https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?
// product=predictions&
// application=NOS.COOPS.TAC.WL&
// begin_date=20220820&
// end_date=20220823&
// datum=MLLW&
// station=8775870&
// time_zone=lst_ldt&
// units=english&
// interval=30&
// format=json

type TideData = {
    t: string, // time in ISO format
    v: number // value in feet
}

  

export function TideChart (props) {
    const swellData = useTideData("8775870", 1);
    if (!swellData.data) {
        return <div style={{color: "white"}}>Loading...</div>;
    }
    console.log("Swell Data:", swellData.data);
    return (
        <div style={{backgroundColor: "black"}}>
            <AreaChart
                width={760}
                height={480}
                data={swellData.data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="t" 
                    domain={['auto', 'auto']}
                    interval={5}
                    tick={{fill: "white"}}
                    tickFormatter={(tick) => {
                        const date = new Date(tick);
                        return date.getHours() % 3 === 0 ? `${date.getHours()}` : ''; // Show labels only for 3-hour intervals
                    }}
                    tickLine={false} // Remove tick lines for intervals without labels
                />
                <YAxis 
                    tick={{fill: "white"}}
                />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
    )
}


