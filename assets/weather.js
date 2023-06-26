function setDate() {
  let date = new Date().toDateString();
  document.getElementById("date").innerHTML = date;
  // localStorage.clear();
}
setDate();

const processSearch = () => {
  var search = document.getElementById("search");
  if (search.value === "") {
    alert("Please enter value to continue");
  } else {
    const searchText = search.value;
    const searchURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=1&appid=f04e076c34717f2c7992e7835aa08168`;

    fetch(searchURL)
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 0) {
          return;
        } else {
          const lat = data[0]["lat"];
          const lon = data[0]["lon"];
          fetchForecasts(searchText, lat, lon);
        }
      });
  }
};

const fetchForecasts = (city, lat, lon) => {
  const searchURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f04e076c34717f2c7992e7835aa08168`;
  fetch(searchURL)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherDetails(city, data["list"]);
      setDataInStorage(city, data["list"]);
      addToHistory(city);
    });
};

const setDataInStorage = (city, data) => {
  localStorage.setItem(city, JSON.stringify(data));
};

const getDataInStorage = (city) => {
  const items = JSON.parse(localStorage.getItem(city));
  if (items) {
    displayWeatherDetails(city, items);
  } else {
    console.log("there are no items");
  }
};

const displayWeatherDetails = (city, data) => {
  let forecastsContainer = document.getElementById("forecasts-container");
  forecastsContainer.replaceChildren();

  data.forEach((item) => {
    const date = new Date(item.dt_txt).toString();
    let forecast = document.createElement("div");
    forecast.classList.add("forecast");
    var forecastDtls = `
        <img class="images" src='https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png'  alt="Dinosaur" />
        <h3 > ${date} </h3>
        <h4> Weather: </h4>
        <div>
          <span >${item.weather[0].main}: ${item.weather[0].description},</span>
          <span >Temp: ${item.main.temp}°F,</span>
          <span >Humidity: ${item.main.humidity}%,</span>
          <span >Wind speed: ${item.wind.speed}MPH,</span>
        </div>
    `;

    forecast.innerHTML = forecastDtls;
    forecastsContainer.appendChild(forecast);
  });

  let cityDetails = document.getElementById("city-details");
  cityDetails.innerHTML = "Weather details for the city of " + city;
};

const addToHistory = (city) => {
  let historyContainer = document.getElementById("history-container");
  let items = JSON.parse(localStorage.getItem("history"));
  if (items) {
    items.push(city);
  } else {
    items = [city];
  }

  // Recreate the list of cities
  let locationlist = document.createElement("ul");
  items.forEach((item) => {
    let locationItem = document.createElement("li");
    var locationBtn = `<button class="search-items" onclick="getDataInStorage('${item}')">${item}</button>`;
    locationItem.innerHTML = locationBtn;
    locationlist.appendChild(locationItem);
  });
  historyContainer.replaceChildren(locationlist);
  localStorage.setItem("history", JSON.stringify(items));
};
