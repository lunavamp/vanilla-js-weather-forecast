const now = new Date();
const minutes = now.getMinutes().toString().padStart(2, '0');
const hours = now.getHours().toString().padStart(2, '0');
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const day = days[now.getDay()];

const element = document.querySelector("li#special");
element.innerHTML = `${day}, ${hours}:${minutes}`;

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = date.toLocaleString("en-US", { weekday: "short" });
  return day;
}

function displayForecast(response) {
  const forecast = response.data.daily.slice(0, 6);

  const forecastElement = document.querySelector("#forecast");
  let forecastHTML = '';

  forecast.forEach(forecastDay => {
    forecastHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
          alt=""
          width="80"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
        </div>
      </div>
    `;
  });

  forecastElement.innerHTML = `
    <div class="row">
      ${forecastHTML}
    </div>
  `;
}

function getForecast(coordinates) {
  const apiKey = "e4c6982bfa42f7e9ae3e51b622915ffe";
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#description").innerHTML = response.data.weather[0].main;

  const iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  const apiKey = "e4c6982bfa42f7e9ae3e51b622915ffe";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  const city = document.querySelector("#city-input").value;
  searchCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

searchCity("Rivne");
displayForecast ();