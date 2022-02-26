//https://www.weather.gov/documentation/services-web-api&sa=D&source=calendar&ust=1641768438693965&usg=AOvVaw3OWCV8Z2DjkIpuF6eXz_L2

async function displayWeatherData(){

    
    const dayTime = document.getElementById("select-daytime").value;
    const info = document.getElementById("info");
    info.innerHTML = '<div id="loading" data-text="Loading…">Loading…</div>';

    try{
    periods = await getWeatherReport();

    for (const period of periods) {
        if (period.name === dayTime) {
            info.innerText = period.temperature +"°"+ period.temperatureUnit;
            info.innerHTML += `<div class="detail-forecast">${period.detailedForecast}</div>`;
        }
    }
}
catch(ex)
{
    info.innerHTML = `<div class="error">${ex.message}</div>`;
}
}

async function getWeatherReport () {

    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;
    
    latitude = formatCoordinate(latitude);
    longitude = formatCoordinate(longitude);

    try{

    
    const response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
    if (response.status=='404')
    throw new Error("No data found for the co-ordinates");
    
    const jsonResponse = await response.json();
    const propertiesAPI = await jsonResponse.properties; 
    const forecastAPI = await propertiesAPI.forecast;
    const weekForecastData = await fetch(forecastAPI);
    const jsonWeekForecastData = await weekForecastData.json();
    const periods = await jsonWeekForecastData.properties.periods;
    return periods;
    }
    catch(ex){
        throw ex;
    }
}

function formatCoordinate(coordinate){

    try{
    
    if(coordinate===null || coordinate==""|| coordinate===undefined)
    throw new Error();
    
    const regex = /[-+]?\d*\.\d*/g;
    const matches=coordinate.match(regex);
    
    return(matches[0]);
    }
    catch(ex)
    {
        throw new Error("Invalid input!");
    }
}