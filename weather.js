

async function displayWeatherData(){   //displays all the data with respect to the input co-ordinates

    const dayTime = document.getElementById("select-daytime").value;
    const info = document.getElementById("info");
    info.innerHTML = '<div id="loading" data-text="Loading…">Loading…</div>';

    try{
    data = await getWeatherReport();
    
    for (const period of data.periods) {
        if (period.name === dayTime) {
            info.innerText = period.temperature +"°"+ period.temperatureUnit;
            info.innerHTML += `<div class="detail-forecast">${period.detailedForecast}</div>`;
            info.innerHTML += `<div class="city-name">${data.city}, ${data.state}</div>`;
            break;   
        }
    }
}
    catch(ex){
            info.innerHTML = `<div class="error">${ex.message}</div>`;
        }
}

async function getWeatherReport () {     //fetches the data from the JSON returned from the API response

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

    const location =  propertiesAPI.relativeLocation;
    const locationProperties =  location.properties;
    const city =  locationProperties.city;
    const state =  locationProperties.state;
    const forecastAPI = await propertiesAPI.forecast;
    const weekForecastData = await fetch(forecastAPI);
    const jsonWeekForecastData = await weekForecastData.json();
    const periods = await jsonWeekForecastData.properties.periods;
    return {periods:periods, city:city, state:state};
    }
    catch(ex){
        throw ex;
    }
}

function formatCoordinate(coordinate){    //Handles the error in the format or type of the input values

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