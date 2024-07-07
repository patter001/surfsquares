import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios"

const buoy42020 = "https://www.ndbc.noaa.gov/data/realtime2/42020.spec"
const corsProxy = "https://corsproxy.io/?"
// const corsProxy = "https://cors-proxy.htmldriven.com/?url="
const buoy4020withCORS = corsProxy + buoy42020

/* Example data
#YY  MM DD hh mm WVHT  SwH  SwP  WWH  WWP SwD WWD  STEEPNESS  APD MWD
#yr  mo dy hr mn    m    m  sec    m  sec  -  degT     -      sec degT
2023 04 13 00 40  1.7  1.6  9.1  0.7  4.0 ENE NNE    AVERAGE  5.8  77
2023 04 13 00 10  1.9  1.7  9.1  0.7  4.5 ENE  NE    AVERAGE  6.0  72
2023 04 12 23 40  1.7  1.5  9.1  0.8  4.0 ENE  NE    AVERAGE  5.6  73
2023 04 12 23 10  1.9  1.7  9.1  0.9  5.0 ENE  NE    AVERAGE  5.8  76
*/
export function windDirectionToDegrees(direction) {
    // Define a mapping of wind directions to their corresponding degrees
    const directionMap = {
        'N': 0,
        'NNE': 22.5,
        'NE': 45,
        'ENE': 67.5,
        'E': 90,
        'ESE': 112.5,
        'SE': 135,
        'SSE': 157.5,
        'S': 180,
        'SSW': 202.5,
        'SW': 225,
        'WSW': 247.5,
        'W': 270,
        'WNW': 292.5,
        'NW': 315,
        'NNW': 337.5
    };

    // Convert the input direction to uppercase to ensure case-insensitivity
    const upperCaseDirection = direction.toUpperCase();

    // Look up the direction in the map and return the corresponding degrees
    // If the direction is not found, return -1 to indicate an invalid direction
    return directionMap[upperCaseDirection] !== undefined ? directionMap[upperCaseDirection] : -1;
}


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
    WWP: string,
    APD: string,
    MWD: string,
}

export interface ProcessedWaveData {
    dateTime: string,
    sigWaveHeight: number,
    averagePeriod: number,
    medianDirection: number    
    swellWaveHeight: number,
    swellPeriod: number,
    swellDirection: number
    windWaveHeight: number,
    windWaveDirection: number,
    windWavePeriod: number
}

function metersToFeet(meters): number {
    return Math.round(meters * 3.28084 * 10) / 10
}

function textBlockToListOfObjects(textBlock) {
    // Split the text block into lines
    const lines = textBlock.trim().split('\n');

    // Split the first line into headers
    let header_line: string = lines[0]
    header_line = header_line.replace("#", "")
    const headers = header_line.split(' ').filter((a) => a !== ''); // Assuming tab-separated values

    // Initialize an array to hold the resulting objects
    const result: BouyData[] = [];

    // Iterate over each subsequent line, but skip lines 0 and 1 as they were the headers
    for (let i = 2; i < lines.length; i++) {
        // Split the line into values
        const values = lines[i].split(' ').filter((a) => a !== '')
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

/** Takes a time string in the form Month:Day hour:minute and converts it from GMT to central
 * 
 */
function convertGMTToCT(gmtString) {

    // Parse the date string
    const gmtDate = new Date(gmtString);

    if (!gmtDate) {
        throw new Error('Invalid date string');
    }

    // Get the offset in minutes between GMT and CT
    const ctOffset = -360; // CDT is UTC-5
    const cdtOffset = -300; // CST is UTC-6

    // Check if Daylight Saving Time is in effect
    const isDST = (gmtDate.toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'short' }).includes('CDT'));
    const offset = isDST ? cdtOffset : ctOffset;
    //const offset = 0

    // Apply the offset to convert GMT to CT
    const ctDate = new Date(gmtDate.getTime() + offset * 60 * 1000);

    // Extract the month, day, hour, and minute
    const month = String(ctDate.getMonth() + 1).padStart(2, '0');
    const day = String(ctDate.getDate()).padStart(2, '0');
    let hours = ctDate.getHours()
    let am = "am"
    if (hours >= 12) {
        am = "pm"
        if(hours>12){
            hours = hours - 12;
        }
    }
    const hoursStr = String(hours).padStart(2, ' ');
    const minutes = String(ctDate.getUTCMinutes()).padStart(2, '0');

    // Format the output string
    return `${month}-${day} ${hoursStr}:${minutes}${am}`;
}


export function useWaveStation(station): UseQueryResult<ProcessedWaveData[]> {

    const url = `https://www.ndbc.noaa.gov/data/realtime2/${station}.spec`
    const urlWithProxy = corsProxy + url
    const latest = new Date().getTime()
    const urlUnique = urlWithProxy + "?" + latest
    axios.defaults.headers.get = {
        //"Cache-Control": "no-cache",        
        //'Expires': '0',
    }
    const query = async () => {
        return await axios.get(urlUnique, {
            params: {
                _ts: new Date().getTime() // Add a unique timestamp to the request URL to prevent caching
            }
        }).then((result) => {
            console.log(result.data)
            const csv = textBlockToListOfObjects(result.data)
            console.log(csv)
            // now convert to our more usable names and types
            const converted: ProcessedWaveData[] = csv.map((row) => {
                const dateTime = convertGMTToCT(`${row.YY}-${row.MM}-${row.DD} ${row.hh}:${row.mm}:00.000`)
                return {
                    dateTime: dateTime,
                    sigWaveHeight: metersToFeet(Number(row.WVHT)),
                    averagePeriod: Number(row.APD),
                    medianDirection: Number(row.MWD),                    
                    swellWaveHeight: metersToFeet(Number(row.SwH)),
                    swellPeriod: Number(row.SwP),
                    swellDirection: windDirectionToDegrees(row.SwD),
                    windWaveHeight: metersToFeet(Number(row.WWH)),
                    windWavePeriod: Number(row.WWP),
                    windWaveDirection: windDirectionToDegrees(row.WWD),
                }
            })
            return converted
        })
    }
    return useQuery({
        queryKey: [station],
        queryFn: query
    })
}

export function useWaveStationCC() {
    return useWaveStation("42020")
}