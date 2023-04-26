const wrapper =document.querySelector('.wrapper'),
weatherBox=wrapper.querySelector('.current-weather');
const currentTempEl = document.getElementById('current-temp');
const weatherForecastEl = document.getElementById('hour-weather-forecast');
const dayForecastEl =document.getElementById('day-weather-forecast');
const feelsDetails=document.querySelector('.feels-like .details');
const humidityDetails = document.querySelector('.humidity .details');
const dayForecastBtn=document.querySelector('header i'),
crossBtn=document.querySelector('.day-weather i');
const searchInput=document.querySelector('#input-box');

let API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";
getWeatherData()

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((sucess)=>{
        let {latitude,longitude}=sucess.coords;
        console.log(sucess);
        let city=displayLocation(latitude,longitude);
        city.then(value=>{
          city=value;
        })
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${API_KEY}&units=metric
        `).then(res => res.json()).then(data=>{
            console.log(data);
            showWeatherData(data,city);
            OtherHourForecast(data);
            OtherDayForecast(data);
            bottomInfo(data);
          })

    })
}


function showWeatherData(data,city){
 let {humidity,pressure,sunrise,sunset,wind_speed,temp}=data.current;
 let {description,icon}=data.current.weather[0];
 console.log(icon);
 weatherBox.innerHTML=` 
 <div class="clouds"> <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
 <p class="description">${description}</p>
 <span class="city">${city}</span>
 </div>
<div class="content">
  <div class="details">
  <span>Tempreture</span>
     <div class="temp">
      <span class="numb">${temp}</span>
      <span class="deg"><sup>°</sup></span>
      <span class="centig">C</span>
   </div>
</div>
    <div class="details">
     <span>Humidity</span>
     <span class="humidity">${humidity}%</span>
   </div>
     <div class="details">
     <span>Pressure</span>
     <span class="pressure">${pressure}</span>
     </div>
     <div class="details">
     <span>Sunrise</span>
     <span class="sunrise">${window.moment(sunrise * 1000).format('HH:mm a')}</span>
     </div>
     <div class="details">
     <span>Sunset</span>
     <span class="sunset">${window.moment(sunset * 1000).format('HH:mm a')}</span>
     </div>
   <div class="details">
   <span>Wind Speed</span>
   <span class="windspeed">${wind_speed}km/h</span>
   </div>
  </div>
 `
}


function OtherHourForecast(data){
let otherHourForcast = '';
let hourlyForecast = data.hourly.slice(2,14);
console.log(hourlyForecast);
   hourlyForecast.forEach((hour, idx) => {
        if(idx == 0){
            otherHourForcast += `
            <div class="weather-forecast-item">
               <div class="time">Now</div>
                <img src="https://openweathermap.org/img/wn//${hour.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
                <div class="temp">${hour.temp}&#176;C</div>
                </div>`;

        }else{
            otherHourForcast += `
            <div class="weather-forecast-item">
                <div class="time">${window.moment(hour.dt*1000).format('HH:mm a')}</div>
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                  <div class="temp">${hour.temp}&#176;C</div>
            </div> `;
        }
    })


    weatherForecastEl.innerHTML = otherHourForcast;
}



function  OtherDayForecast(data){
  let otherDayForcast="";
     console.log(data.daily); 
    data.daily.forEach((day,idx)=>{
      if(idx == 0){
        otherDayForcast += `
        <div class="weather-forecast-item">
            <div class="day">Today</div>
            <img src="https://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
               <div class="temp night">${day.temp.night}&#176;C</div>
                <div class="temp day">${day.temp.day}&#176;C</div>
            </div>`;

    }else{
         otherDayForcast += `
        <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp night">${day.temp.night}&#176;C</div>
            <div class="temp day">${day.temp.day}&#176;C</div>
        </div> `;
    }

    })
  
    dayForecastEl.innerHTML = otherDayForcast;
}



dayForecastBtn.addEventListener('click',()=>{
  wrapper.classList.toggle('active');
  console.log('clicked');

})

crossBtn.addEventListener('click',()=>{
  wrapper.classList.remove('active');

})


function bottomInfo(data){
  let {feels_like,humidity}=data.current;
  feelsDetails.innerHTML=`<div class="temp">${feels_like}&#176;C</div>`;
  humidityDetails.innerHTML=`<div class="humidity">${humidity}%</div>`;

}



function fetchWeather(city ,coordsAPI){
  if(coordsAPI.length==0){
    alert("Enter Valid city name");
  }else{
    console.log(coordsAPI);
    let {lat,lon}=coordsAPI[0];
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}&units=metric
    `).then(res => res.json()).then(data=>{
        showWeatherData(data,city);
        OtherHourForecast(data);
        OtherDayForecast(data);
        bottomInfo(data);
      })
  }


}


function fetchCity(city){
    let url=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
    fetch(url).then(res =>res.json()).then(coordsAPI => fetchWeather(city ,coordsAPI));
}

searchInput.addEventListener("keyup",e=>{
  if(e.key === 'Enter' && e.target.value){
    fetchCity(e.target.value);
}

})

async function displayLocation(latitude,longitude){
  const GEOCODING_URL=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`;
  const response=await fetch(GEOCODING_URL);
  const data = await response.json();
  if(data.length>0){
    let city=data[0].name;
    return city;
  }else{
    return null;
  } 
}


const MAPBOX_TOKEN="pk.eyJ1IjoiYW5hbnlhaWlpdHIiLCJhIjoiY2xndWN3ajY1MjEybzNqbXRleG1pYWNuMCJ9.iNZtJqCNDVsABQubGPVvcA";
const suggestions = document.getElementById("suggestions");
searchInput.addEventListener("input", async () => {
  const inputText = searchInput.value.trim();
  if (inputText.length >= 3) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputText}.json?access_token=${MAPBOX_TOKEN}&types=place&limit=5`;
    const response = await fetch(url);
    const data = await response.json();
    const cityList = data.features.map((feature) => feature.place_name);
    suggestions.innerHTML = "";
    cityList.forEach((city) => {
      const suggestionItem = document.createElement("li");
      suggestionItem.textContent = city;
      suggestionItem.addEventListener("click", () => {
        searchInput.value = city;
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(suggestionItem);
    });
  } else {
    suggestions.innerHTML = "";
  }
});



