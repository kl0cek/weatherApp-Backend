import { isValid } from "./utils/validators.js";
import { fetchWeatherData, parseDailySummary, parseWeeklySummary } from "./weatherService.js";

export async function getDailySummary(req, res) {
    const { latitude, longitude } = req.query;

    console.log('latitude:', req.query.latitude);
    console.log('longitude:', req.query.longitude);

    if( !isValid(latitude, longitude)) {
        return res.status(400).json({ error: 'Invalid coordinates'});
    }

    try {
        const data = await fetchWeatherData(latitude, longitude);
        if (!data) {
            return res.status(500).json({ error: 'No weather data received' });
        }
        //console.log('Received weather data:', data);
        const result = parseDailySummary(data);
        res.json(result)
    }catch (err){
        console.error('Error in getDailySummary:', err);
        res.status(500).json({ message: err.message })
    }
}

export async function getWeeklySummary(req,res) {
    const { latitude, longitude} = req.query;

    if(!isValid(latitude,longitude)) {
        return res.status(400).json({ error: 'Invalid coordinates'})
    }

    try {
        const data = await fetchWeatherData(latitude, longitude);
        if (!data) {
            return res.status(500).json({ error: 'No weather data received' });
        }
        //console.log('Received weather data:', data);
        const result = parseWeeklySummary(data);
        res.json(result)

    }catch (err) {
        console.error('Error in getWeeklySummary:', err);
        res.status(500).json({ message: err.message })
    }
}