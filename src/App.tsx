import * as React from "react";
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
    const waveInfoStyle: CSSProperties = {alignContent: "center", }
    
    return (
        <div style={containerSytle}>
            <div key="packery-wind" className={"FlexGrid"} style={packeryStyle}>
                <WindGaugePackery />
            </div>
            <div key="porta-wind" className={"FlexGrid"} style={portAStyle}>
                <WindGaugePortA />
            </div>    
            <div key="windy"
                className={"FlexGrid"}
                data-windywidget="forecast"
                data-thememode="white"
                data-spotid="4014467"
                data-appid="5201fb63c5989e3cda6f1eb0fdc42d8b">1
            </div>
            {/* <div className={"FlexGrid"}>
                <img src="https://www.ndbc.noaa.gov//spec_plot.php?station=42020"/>
            </div> */}
            <div key="waves" className={"FlexGrid"} style={waveInfoStyle}><WaveInfo42020/></div>
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


export function App() {
    // return (
    //     <MobileApp/>
    // )
    const packeryImage = new URL("./images/packery.jpg", import.meta.url)
    const portAImage = new URL("./images/portA.jpg", import.meta.url)
    return (
        <QueryClientProvider client={queryClient}>
            <div style={{ width: "100%", height: "100vh" }}>
                <TvApp />
            </div>
        </QueryClientProvider>
    )
}


