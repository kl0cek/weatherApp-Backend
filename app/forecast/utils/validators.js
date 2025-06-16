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