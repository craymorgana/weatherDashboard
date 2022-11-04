var apiKey = "a6ea10bab8b56bd7a6e1dcdc025bd8a7";
var searchInput = document.querySelector(".input-form");
var searchButton = document.querySelector('.submit-button');
var forecast = document.querySelector('forcast-card');
var lat = 0;
var lon = 0;
var temp = 0;
var wind = 0;
var humidity = 0;
var weatherIconId = "";

function getLocation(){
    var locationAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value},840&limit=1&appid=${apiKey}`;
    
    fetch(locationAPI)
    .then(function(response){
        return response.json()
    })
    .then(function(location){
        console.log('data :>> ', location);
        lat = location[0].lat;
        lon = location[0].lon;
        getWeather(lat, lon);
    })

}

function getWeather(lat, lon){


    var weatherCallApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(weatherCallApi)
    .then(function(response){
        return response.json()
    })
    .then(function(weather){
        //getting values
        console.log('data :>> ', weather);
        temp = weather.list[0].main.temp
        temp = (temp - 273.15)*1.8 + 32
        humidity = weather.list[0].main.humidity;
        wind = weather.list[0].wind.speed
        wind = wind * 2.2369;
        weatherIconId = weather.list[0].weather[0].icon;
        
        
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${year}-${month}-${day}`;
        
        //create elements
        var daily = document.getElementById('daily-card')
        var col = document.createElement('div');
        var card = document.createElement('div');
        var cardBody = document.createElement('div');
        var cardTitle = document.createElement('h3');
        var weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconId}@2x.png`;
        var weatherIcon = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');

        //resets 
        daily.innerHTML = "";
        $('.forecast-card').empty();

        col.append(card);
        card.append(cardBody);
        cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
        weatherIcon.setAttribute('src', weatherIconURL)
        
        // Add content to elements
        cardTitle.textContent = searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1) + " " + currentDate;
        weatherIcon.textContent = `${weatherIconId}`;
        tempEl.textContent = `Temp: ${Math.floor(temp)}°F`;
        windEl.textContent = `Wind: ${Math.floor(wind)} MPH`;
        humidityEl.textContent = `Humidity: ${humidity}%`;
        daily.append(col);

        for(let i = 6; i <= 38; i = i+8){
            temp = 0;
            weatherIconId = weather.list[i].weather[0].icon
            weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconId}@2x.png`;
            const forecastCard = 
                `<div id='forecast'>
                <h2>${weather.list[i].dt_txt}</h2>
                <img src='${weatherIconURL}';
                <br>
                <p>Temp ${Math.floor((weather.list[i].main.temp-273.15)*1.8 + 32)}°F</p>
                <p>Wind ${Math.floor(weather.list[i].wind.speed)}  MPH</p>
                <p>Humidity: ${weather.list[i].main.humidity}%</p>`;
                $('.forecast-card').append(forecastCard);
        }
    })
    
}

function weatherSearch(event){
    event.preventDefault();
    getLocation();

}

searchButton.addEventListener('click', weatherSearch);

