const inputel = document.querySelector(".cityinput");
const formel = document.querySelector(".ipcityform");
const apiKey = "9cd4054bf7444999aa7121627242910";

formel.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = inputel.value;
    fetchWeather(city);
});

function fetchWeather(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function displayWeather(data) {
    const weathercard = document.querySelector(".card");
    const cardContainer = document.querySelector(".cardcontainer");

    const temp = data.current.temp_c;
    let gradient = "";

    if (temp < 15) {
        gradient = "linear-gradient(to bottom, #4c8cff, #b3e1ff)";
    } else if (temp < 25) {
        gradient = "linear-gradient(to bottom, #ffe6b3, #ffcc66)";
    } else {
        gradient = "linear-gradient(to bottom, #ff6666, #ff1a1a)";
    }

    cardContainer.style.background = gradient;

    let uvClass = "";
    let uvText = "";
    const uvIndex = data.current.uv;
    if (uvIndex < 3) {
        uvClass = "low-uv";
        uvText = "Low";
    } else if (uvIndex < 6) {
        uvClass = "moderate-uv";
        uvText = "Moderate";
    } else if (uvIndex < 8) {
        uvClass = "high-uv";
        uvText = "High";
    } else {
        uvClass = "very-high-uv";
        uvText = "Very High";
    }

    let heatIndexClass = "";
    let heatIndexText = "";
    const heatIndex = data.current.heatindex_c;
    if (heatIndex < 27) {
        heatIndexClass = "low-heat";
        heatIndexText = "Low";
    } else if (heatIndex < 32) {
        heatIndexClass = "moderate-heat";
        heatIndexText = "Moderate";
    } else {
        heatIndexClass = "high-heat";
        heatIndexText = "High";
    }

    weathercard.innerHTML = `
        <div class="temp">
            <p class="cityname">${data.location.name}, ${data.location.country}</p>
            <p class="temph">${data.current.temp_c} &deg;C</p>
            <div class="climate">
                <img src="${data.current.condition.icon}" alt="${data.current.condition.text}" height="12px">
                <p class="climatetype">${data.current.condition.text}</p>
            </div>
        </div>
        <div class="extras">
            <div class="feelslike">
                <div class="fp1">
                    <p class="bigh">${data.current.feelslike_c}</p>
                    <p class="smallh">&deg;C</p>
                </div>
                <p class="ftext">Feels Like</p>
            </div>
            <div class="wind">
                <div class="wp1">
                    <p class="bigh">${data.current.wind_kph}</p>
                    <p class="smallh">Kph</p>
                </div>
                <p class="ftext">Wind Speed</p>
            </div>
            <div class="humidity">
                <div class="hup1">
                    <p class="bigh">${data.current.humidity}%</p>
                </div>
                <p class="ftext">Humidity</p>
            </div>
             <div class="aqi">
                <div class="fp1">
                    <p class="bigh">${data.current.windchill_c}</p>
                    <p class="smallh">&degC</p>
                </div>
                <p class="ftext">Wind Chills</p>
            </div>
            <div class="aqi">
                <div class="aqp1">
                    <p class="bigh ${uvClass}">${data.current.uv}</p>
                    <p class="smallh ${uvClass}">${uvText}</p>
                </div>
                <p class="ftext">UV Index</p>
            </div>
            <div class="aqi">
                <div class="aqp1">
                    <p class="bigh ${heatIndexClass}">${data.current.heatindex_c}</p>
                    <p class="smallh ${heatIndexClass}">${heatIndexText}</p>
                </div>
                <p class="ftext">Heat Index</p>
            </div>
           
        </div>
    `;
}
