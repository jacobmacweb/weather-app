import axios from "axios";

const KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_BASE_URI = "http://api.weatherapi.com/v1/";
const API_FORECAST_BASE_URI = `${API_BASE_URI}forecast.json?key=${KEY}&q=`

// Using top-level cache goes against React design principles, but for this
// case, it's acceptable.
const cache: {
    [location: string]: { data: any, date: number }
} = {};


interface IWeatherForecastOptions {
    /**
     * Amount of time it takes for requests to expire
     */
    expireTime?: number
}

interface Location {
    name: string,
    region: string,
    country: string,
    lat: number,
    lon: number,
    tz_id: string,
    localtime_epoch: number,
    localtime: string
}

interface Condition {
    text: string;
    icon: string;
    code: number;
}

interface Current {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
}

interface Day {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: Condition;
    uv: number;
}

interface Astro {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
}

interface Hour {
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
}

interface Forecastday {
    date: string;
    date_epoch: number;
    day: Day;
    astro: Astro;
    hour: Hour[];
}

interface Forecast {
    forecastday: Forecastday[];
}

export interface IWeatherForecastReturnData {
    location: Location;
    current: Current;
    forecast: Forecast;
}

/**
 * Get forecast data either from cache or direct request for a specific location
 * @param place Place name
 * @param options Options on caching
 * @returns Weather forecast data promise
 */
export default function getWeatherForecast(place: string, options?: IWeatherForecastOptions): Promise<IWeatherForecastReturnData> {
    return new Promise((resolve, reject) => {
        const expiryTime = options?.expireTime ?? 10 * 1000 * 60 // 10 minutes expiry

        const data = cache[place];
        if (data && (Date.now() - data.date) < expiryTime) {
            return data.data;
        } else {
            axios.get(API_FORECAST_BASE_URI + encodeURIComponent(place)).then(res => {
                cache[place] = {
                    data: res.data,
                    date: Date.now()
                };
                resolve(res.data);
            }).catch(reject);
        }
    })
}