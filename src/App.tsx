import * as React from "react";
import { useEffect, useState } from "react";
import { WaveInfo42020 } from "./components/SwellFromBuoy"
import { WindGaugePackery, WindGaugePortA } from "./components/WindGauge";
import { CSSProperties } from "react";
import {
    QueryClient,
    QueryClientProvider,
    useQueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10*60*1000, // 10 minutes
        },
    },
})

import "./App.css"
import { TideChart } from "./components/TideChart";
const flexSquare = { flex: "1 0 50%", width: "50%", height: "50%", flexWrap: "wrap" }

export function TvApp() {
    const packeryImage = new URL("./images/packery.jpg", import.meta.url)
    const portAImage = new URL("./images/portA.jpg", import.meta.url)
    const containerSytle: CSSProperties = { display: "flex", flexWrap: "wrap", height: "100%", width: "100%" };
    const packeryStyle: CSSProperties = { backgroundImage: `url(${packeryImage})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", backgroundPosition: "left bottom" }
    const portAStyle: CSSProperties = { backgroundImage: `url(${portAImage})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" };
    const waveInfoStyle: CSSProperties = { alignContent: "center", }
    const [squareOrder, setSquares] = useState({ order: [0, 1, 2, 3] })
    const order = squareOrder.order
    const client = useQueryClient()

    useEffect(()=>{
        setInterval(()=>{
            client.invalidateQueries()
        }, 10*60*1000)
    },[queryClient])

    let height: number;
    let width: number;
    if(window.visualViewport){
        height = window.visualViewport.height
        width = window.visualViewport.width;
    } else {
        height = window.innerHeight;
        width = window.innerWidth
    }
    let fullScreen = height*width > (900*500)
 
    const updateOrder = () => {
        setSquares((prev) => {
            let newOrder = prev.order.slice(2, 4)
            newOrder.push(prev.order[0])
            newOrder.push(prev.order[1])
            return { order: newOrder }
        })
    }
    useEffect(() => {
        setTimeout(updateOrder, 1.5 * 60 * 1000) // 1.5 minutes
        //setTimeout(updateOrder, 10 * 1000) // 10 seconds
    }, [squareOrder])

    let squares: React.ReactElement[];
    // fullScreen = false
    if(fullScreen){
        squares = [
            (
                <div key="packery-wind" className={"FlexGrid"} style={packeryStyle}>
                    <WindGaugePackery />
                </div>
            ),
            (
                <div key="porta-wind" className={"FlexGrid"} style={portAStyle}>
                    <WindGaugePortA />
                </div>
            ),
            (
                <div key="windy" className={"FlexGrid"}><WindyEmbed /></div>
    
            ),
            (
                <div key="waves" className={"FlexGrid"} style={waveInfoStyle}><WaveInfo42020 count={5} /></div>
            )
        ]
    } else {
        squares = [
            (
                <div key="packery-wind" className={"FlexGrid"} style={packeryStyle}>
                    <WindGaugePackery />
                </div>
            ),
            (
                <div key="porta-wind" className={"FlexGrid"} style={portAStyle}>
                    <WindGaugePortA />
                </div>
            ),
            (
                <div key="windy" className={"FlexGrid"}><TideChart/></div>
            ),
            (
                <div key="waves" className={"FlexGrid"} style={waveInfoStyle}><WaveInfo42020 count={2} /></div>
            )
        ]        
        // squares = [
        //     (
        //         <div className={"column"}>
        //         <div key="packery-wind" className={"item"} style={packeryStyle}>
        //             <WindGaugePackery />
        //         </div>
        //         <div key="porta-wind" className={"item"} style={portAStyle}>
        //             <WindGaugePortA />
        //         </div>
        //         </div>
        //     ),
        //     (
        //         <></>
        //     ),
        //     (
        //         <div className={"column"}>
        //             <div key="waves" className={"item"} style={waveInfoStyle}>
        //                 <WaveInfo42020 count={2} />
        //             </div>
        //             <div key="tide" className={"item"} >
        //                 <TideChart/>
        //             </div>
        //         </div>
        //     ),
        //     (
        //         <></>
        //     )
        //]       
    }
    return (
        <div style={containerSytle}>
            {order.map((m)=>squares[m])}
        </div>
    )
}

const useScript = url => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

function WindyEmbed() {
    useScript("https://windy.app/widgets-code/forecast/windy_forecast_async.js?v1.4.6")
    return (
        <div key="windy"
            data-windywidget="forecast"
            data-thememode="white"
            data-spotid="4014467"
            data-appid="5201fb63c5989e3cda6f1eb0fdc42d8b">1
        </div>
    )
}

export function App() {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <QueryClientProvider client={queryClient}>

                <TvApp />

            </QueryClientProvider>
        </div>
    )
}


