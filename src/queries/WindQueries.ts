import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios";

// const packeryStation = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=8775792&product=wind&datum=STND&time_zone=lst_ldt&units=english&format=json"
// const portAStation =   "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=8775241&product=wind&datum=STND&time_zone=lst_ldt&units=english&format=json"

const packeryWind = "8775792";
const portAWind = "8775241";

export interface Wind {
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

export function useWindStation(station): UseQueryResult<Wind[]>{
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

export function usePackaryWind(){
    return useWindStation(packeryWind)
}


export function usePortAWind(){
    return useWindStation(portAWind)
}