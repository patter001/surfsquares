import axios from "axios";
import React, { useCallback, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
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



export function TideChart(props) {
    const swellData = useTideData("8775870", 1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    const [observer, setObserver] = React.useState<ResizeObserver | null>(null);

    const updateDimensions = useCallback((entries) => {
        console.warn("ResizeObserver entries:", entries);
        for (let entry of entries) {
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            })
            break
        }
    }, [])

    useEffect(()=>{

    }, [containerRef.current]);
    // useEffect(() => {
    //         return () => {
    //             if (observer) {
    //                 observer.disconnect();
    //             }
    //         };
    // }, [observer]);
    // if(containerRef.current && !observer){
    //     const newObserver = new ResizeObserver(updateDimensions);
    //     newObserver.observe(containerRef.current);
    //     setObserver(newObserver);
    // }
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }))
    const nowX = now.getHours() + 0.5 * Math.floor(now.getMinutes() / 30);

    if (!swellData.data) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }
    const processedData = swellData.data.map((entry) => {
        const date = new Date(entry.t);
        const hour = date.getHours() + date.getMinutes() / 60; // Convert to decimal hour    
        return {
            hour: hour, // Convert to timestamp for better handling
            v: entry.v
        }
    })
    let width = 449;
    let height = 249;
    // if(containerRef.current && dimensions.width === 0){
    //     width = containerRef.current.clientWidth;
    //     height = containerRef.current.clientHeight;
    // } else if (dimensions.width > 0) {
    //     width = dimensions.width;
    //     height = dimensions.height;
    // }
    return (
        <div id={"tide-chart"} ref={containerRef} style={{ margin: 0, backgroundColor: "black", width: "100%", height: "100%" }}>
            <AreaChart
                width={width}
                height={height}
                data={processedData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="hour"
                    domain={['auto', 'auto']}
                    interval={5}
                    tick={{ fill: "white" }}
                    tickFormatter={(tick) => {
                        return tick % 3 === 0 ? `${tick}` : ''; // Show labels only for 3-hour intervals
                    }}
                    tickLine={false} // Remove tick lines for intervals without labels
                />
                <YAxis
                    tick={{ fill: "white" }}
                />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#8884d8" fill="#8884d8" />
                <ReferenceLine
                    key={"currentHour"}
                    x={nowX}
                    stroke="red"
                />
            </AreaChart>
        </div>
    )
}


