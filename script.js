const apiKey = "dcbfe3ad74af7c5cbff05a36f675eed4"; 

let isCelsius = true;
let currentTemp = null; 

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorText = document.getElementById("error");


searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => showError("Unable to retrieve your location.")
    );
  } else {
    showError("Geolocation is not supported by this browser.");
  }
});

function fetchWeatherByCity(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => updateWeather(data))
    .catch(() => showError("Error fetching weather data."));
}

function fetchWeatherByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => updateWeather(data))
    .catch(() => showError("Error fetching weather data."));
}

function updateWeather(data) {
  if (data.cod !== 200) {
    showError(data.message);
    return;
  }

  weatherInfo.classList.remove("hidden");
  errorText.classList.add("hidden");

  document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
  currentTemp = data.main.temp;
  isCelsius = true;
  updateTempDisplay();

  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("pressure").textContent = data.main.pressure;
}

function updateTempDisplay() {
  const tempElement = document.getElementById("temp");
  const toggleBtn = document.getElementById("toggleUnitBtn");

  if (isCelsius) {
    tempElement.textContent = `${currentTemp.toFixed(1)}°C`;
    toggleBtn.textContent = "Switch to °F";
  } else {
    const fTemp = (currentTemp * 9) / 5 + 32;
    tempElement.textContent = `${fTemp.toFixed(1)}°F`;
    toggleBtn.textContent = "Switch to °C";
  }
}
document.getElementById("toggleUnitBtn").addEventListener("click", () => {
  isCelsius = !isCelsius;
  updateTempDisplay();
});


function showError(message) {
  weatherInfo.classList.add("hidden");
  errorText.classList.remove("hidden");
  errorText.textContent = `❗ ${message}`;
}



