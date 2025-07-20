//surface_pressure_mean not working

import axios from 'axios'
import { formatDate } from './utils/validators.js';

export async function fetchWeatherData(lat, lon) {
    const url = process.env.WEATHER_API_URL

    const params = {
        latitude: lat,
        longitude: lon,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunshine_duration,surface_pressure_mean,precipitation_sum,surface_pressure_max,surface_pressure_min',
        timezone: 'auto'
    };

    const response = await axios.get(url, { params });
    return response.data;
}

export function parseDailySummary(data) {
    const days = data.daily.time.map((date, index) => ({
        date: formatDate(date),
        weathercode: data.daily.weather_code[index],
        temperature_min: data.daily.temperature_2m_min[index],
        temperature_max: data.daily.temperature_2m_max[index],
        solar_energy: round(calcEnergyProduction(data.daily.sunshine_duration[index]))
    }));

    return { daily: days};
}

export function parseWeeklySummary(data) {
    const days = data.daily;
    const count = days.time.length;

    const dailyAvgPressures = days.surface_pressure_max.map((maxPressure, index) => {
        const minPressure = days.surface_pressure_min[index];
        
        const avgForDay = averagePressure(maxPressure, minPressure);
        return avgForDay;
    });

    const avgPressure = average(dailyAvgPressures);
    const avgSunshine = average(days.sunshine_duration.map(sec => sec / 3600));

    const minTemp = Math.min(...days.temperature_2m_min);
    const maxTemp = Math.max(...days.temperature_2m_max);

    const rainyDays = days.precipitation_sum.filter(val => val >0).length;


    return {
        average_pressure: round(avgPressure),
        average_sunshine: round(avgSunshine),
        min_temperature: minTemp,
        max_temperature: maxTemp,
        summary: `${rainyDays} deszczowe dni - ${rainyDays >= 4 ? 'deszczowy tydzień': 'słoneczny tydzień'}`
    };
}

function average(arr) {
    const sum = arr.reduce((a,b) => a+b, 0);
    return arr.length ? sum / arr.length : 0;
}

function averagePressure(max, min) {
    
    if (max === undefined || min === undefined || max === null || min === null) {
        
        return 0;
    }
    const result = (max + min) / 2;
    
    return result;
}

function round(num) {
    return Math.round(num*10) /10;
}

function calcEnergyProduction(sunDuration){
    let panelEff = 0.2;
    let photovoltaicPower = 2.5;

    const timeHour = sunDuration / 3600;

    return photovoltaicPower * timeHour * panelEff;
}