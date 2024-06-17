import * as React from "react";
import { useEffect, useState } from "react";
import { WaveInfo42020 } from "./components/SwellFromBuoy"
import { WindGaugePackery, WindGaugePortA } from "./components/WindGauge";
import { CSSProperties } from "react";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
const queryClient = new QueryClient()
import "./App.css"
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

    const updateOrder = () => {
        setSquares((prev) => {
            let newOrder = prev.order.slice(2, 4)
            newOrder.push(prev.order[0])
            newOrder.push(prev.order[1])
            return { order: newOrder }
        })
    }
    useEffect(() => {
        setTimeout(updateOrder, 3 * 60 * 1000)
    }, [squareOrder])


    let squares = [
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
            <div key="waves" className={"FlexGrid"} style={waveInfoStyle}><WaveInfo42020 /></div>
        )
    ]

    return (
        <div style={containerSytle}>
            {squares[order[0]]}
            {squares[order[1]]}
            {squares[order[2]]}
            {squares[order[3]]}
        </div>
    )

    return (
        <div style={containerSytle}>

            <div key="packery-wind" className={"FlexGrid"} style={packeryStyle}>
                <WindGaugePackery />
            </div>
            <div key="porta-wind" className={"FlexGrid"} style={portAStyle}>
                <WindGaugePortA />
            </div>
            <div key="windy" className={"FlexGrid"}>
                <WindyEmbed />
            </div>
            {/* <div className={"FlexGrid"}>
                <img src="https://www.ndbc.noaa.gov//spec_plot.php?station=42020"/>
            </div> */}
            <div key="waves" className={"FlexGrid"} style={waveInfoStyle}><WaveInfo42020 /></div>
            {/* <div
                className={"FlexGrid"}
                data-windywidget="map"
                data-spotid="4014467"
                data-appid="5201fb63c5989e3cda6f1eb0fdc42d8b"
                data-spots="true">2
            </div> */}
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
    // return (
    //     <MobileApp/>
    // )
    const packeryImage = new URL("./images/packery.jpg", import.meta.url)
    const portAImage = new URL("./images/portA.jpg", import.meta.url)
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <QueryClientProvider client={queryClient}>

                <TvApp />

            </QueryClientProvider>
        </div>
    )
}


