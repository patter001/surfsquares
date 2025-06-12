import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface TideData {
    t: string; // time in ISO format
    v: number; // value in feet
}   

export function useTideData(station: string, days: number): UseQueryResult<TideData[]>{
    const noa_url = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter")

    const query = async () => {

        // Fix date time to be today
        let d = new Date()
        let month = (d.getMonth()+1).toString().padStart(2,"0")
        let day = d.getDate().toString().padStart(2,"0")
        const begin_date = `${d.getFullYear()}${month}${day}`
        d.setDate( d.getDate()+ days-1)
        month = (d.getMonth()+1).toString().padStart(2,"0")
        day = d.getDate().toString().padStart(2,"0")
        const end_date = `${d.getFullYear()}${month}${day}`
        const params = {
            product: "predictions",
            application: "NOS.COOPS.TAC.WL",
            begin_date: begin_date, // example: "20220810",
            end_date: end_date, // example "20220814",
            datum: "MLLW",
            station: station, // example: "8775870",
            time_zone: "lst_ldt",
            units: "english",
            interval: "30",
            format: "json"
        }
        for(const [key,value] of Object.entries(params)){
            noa_url.searchParams.append(key, value)
        }
        let data = await axios.get(noa_url.href);
        return data.data.predictions;
    }
    return useQuery({
        queryKey: ["tide", station, days],
        queryFn: query
    })
}