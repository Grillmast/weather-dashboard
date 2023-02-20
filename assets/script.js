//Sets cityName and displayCity to the global scope
let cityName;
const apiKey = 'e4301057cd4c095dc3d480e29dd18522';
const units = "imperial";

$(document).ready(function() {
  $("#searchBtn").click(function() {
    cityName = $("#searchCity").val();
    searchWeather(cityName);
  });
  displayPreviousSearches();
});

function searchWeather(cityName) {
  weather(cityName);
  displayPreviousSearches();
}

//Grabbing our previously searched cities from local storage and displaying them as buttons to be clicked on. *Currently this code is not working*
function displayPreviousSearches() {
  let cityData = localStorage.getItem("cities");
  if (cityData === null) {
    return;
  }
  cityData = JSON.parse(cityData);
  let previousSearchesElement = document.getElementById("previous-searches");
  previousSearchesElement.innerHTML = ""; //This will clear the previous searches element
  for (let city of cityData) {
    let cityButton = document.createElement("button");
    cityButton.innerHTML = city;
    cityButton.addEventListener("click", function() {
      searchWeather(city);
    });
    previousSearchesElement.appendChild(cityButton);
  }
}

//This will be our main function to access our api and show not only the 5-day forecast but also the current forecast.
function weather(cityName) {
  var requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`
  var requestCurrentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`
//Grabbing our URL and displaying our 5-day Forecast
  fetch(requestWeatherUrl)
  .then(function (response) {
    return response.json();
  }) 
  .then(function(data) {
    var list = data.list;
    var weatherDiv = document.querySelector("#forecast");
    weatherDiv.innerHTML = "";
    for (var i = 0; i < list.length; i+=8) {
      var date = new Date(list[i].dt * 1000);
      var temperature = list[i].main.temp;
      var weatherDescription = list[i].weather[0].description;
      var icon = list[i].weather[0].icon;
      var windSpeed = list[i].wind.speed;
      var humidity = list[i].main.humidity;
    weatherDiv.innerHTML += `<div class="card">
                            <h2 class="card-title">${date.toLocaleDateString()}</h2>
                            <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather-icon">
                            <p class="card-text">Temperature: ${temperature}°F</p>
                            <p class="card-text">Weather: ${weatherDescription}</p>
                            <p class="card-text">Wind Speed: ${windSpeed} mph</p>
                            <p class="card-text">Humidity: ${humidity}%</p>
                            </div>`;
    }
    storeCity(cityName);
    displayPreviousSearches();
  })
  .catch(function(error) {
    console.error("An error has occured:", error)
  });
//Grabbing our current weather and displaying it as such
  fetch(requestCurrentWeatherUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var currentTemperature = data.main.temp;
    var currentWeatherDescription = data.weather[0].description;
    var currentCity = data.name;
    var icon = data.weather[0].icon;
    var currrentWeatherDiv = document.querySelector("#currentWeather");
    var windSpeed = data.wind.speed;
    var humidity = data.main.humidity;
    currrentWeatherDiv.innerHTML = `<div class="card">
                                    <h2 class="card-title">Weather in ${currentCity}</h2>
                                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather-icon">
                                    <p class="card-text">Temperature: ${currentTemperature}°F</p>
                                    <p class="card-text">Weather: ${currentWeatherDescription}</p>
                                    <p class="card-text">Wind Speed: ${windSpeed} mph</p>
                                    <p class="card-text">Humidity: ${humidity}%</p>
                                    </div>`;
  })
  .catch(function(error) {
    console.error("An error has occured:", error)
  });

//Storing our previously searched cities into local storage.
function storeCity(cityName) {
  let cityData = localStorage.getItem("cities");
  if (cityData === null) {
    cityData = [];
  } else {
    cityData = JSON.parse(cityData);
  }
  if (!cityData.includes(cityName)) {
    cityData.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cityData));
  };
};
}