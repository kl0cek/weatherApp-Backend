// can be better but let makees it for now like this 
// TODO: more accurate

export function isValid(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    return (
        !isNaN(latitude) && !isNaN(longitude) &&
        latitude >= -90 && latitude <= 90 &&
        longitude >= -180 && longitude <= 180
    );
}

export function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function isValidDailyForecast(obj) {
  return (
    typeof obj.date === 'string' &&
    typeof obj.weathercode === 'number' &&
    typeof obj.temperature_min === 'number' &&
    typeof obj.temperature_max === 'number' &&
    typeof obj.solar_energy === 'number'
  );
}

export function isValidWeeklyForecast(obj) {
  return (
    typeof obj.average_pressure === 'number' &&
    typeof obj.average_sunshine === 'number' &&
    typeof obj.min_temperature === 'number' &&
    typeof obj.max_temperature === 'number' &&
    typeof obj.summary === 'string'
  );
}