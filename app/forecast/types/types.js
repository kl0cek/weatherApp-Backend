const DailyForecast = {
    date: String,
    weatherCode: Number,
    temperature_min: Number,
    temperature_max: Number,
    solar_energy: Number
};


const WeeklyForecast = {
    average_pressure: Number,
    average_sunshine: Number,
    min_temperature: Number,
    max_temperature: Number,
    summary: String
};



module.exports = {
    DailyForecast,
    WeeklyForecast
};


