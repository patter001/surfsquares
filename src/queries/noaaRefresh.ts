export const NOAA_DATA_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export function shouldRefreshNoaaData(): boolean {
    const hour = new Date().getHours();
    return hour >= 5;
}

export function getNoaaRefetchInterval(): number | false {
    return shouldRefreshNoaaData() ? NOAA_DATA_REFRESH_INTERVAL_MS : false;
}
