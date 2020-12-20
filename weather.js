  //Declaring variables
 var input = document.getElementById("city-input");
  var city = document.getElementById("search-button");
  var clear = document.getElementById("clear-history");
 var name = document.getElementById("city-name");
 var weather = document.getElementById("weather");
 var currentTemp = document.getElementById("temperature");
  var currentHumidity = document.getElementById("humidity");4
 var currentWind = document.getElementById("wind-speed");
 var currentUV = document.getElementById("UV-index");
 var history = document.getElementById("history");
 var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
 console.log(searchHistory);
    
//The name of API key for weather app
    var APIKey = "b27e7d30cce9afc9ff3978aead8c6654";

//   the city name is displayed by the user when clicked the button

 function getWeather(cityName) {
//  Using saved city name, execute a current condition get request from open weather map api
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
 axios.get(queryURL)
 .then(function(response){
 console.log(response);

//  Parse Response Method- parsed response received from webservice and returns to the objects which turns into data 
// "date" objects obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 var currentDate = new Date(response.data.dt*1000);
  console.log(currentDate);
 var day = currentDate.getDate();
 var month = currentDate.getMonth() + 1;
 var year = currentDate.getFullYear();
            
 name.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
  var  weatherPic = response.data.weather[0].icon;
            
 current.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
 current.setAttribute("alt",response.data.weather[0].description);
            
  currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
  currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
      
  var lat = response.data.coord.lat;
  var  lon = response.data.coord.lon;
       
 var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
 axios.get(UVQueryURL)
 .then(function(response){
 var  UVIndex = document.createElement("span");
UVIndex.setAttribute("class","badge badge-danger");
 UVIndex.innerHTML = response.data[0].value;
 currentUV.innerHTML = "UV Index: ";
 currentUV.append(UVIndex);
        });

//  Execute 5 day forecast to get request from the API call
var cityID = response.data.id;
 var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
  axios.get(forecastQueryURL)
 .then(function(response){

//  Parse response to display forecast for next 5 days underneath current conditions
 console.log(response);
  var forecastEls = document.querySelectorAll(".forecast");
for (i=0; i<forecastEls.length; i++) {
 forecastEls[i].innerHTML = "";
  
  var forecastIndex = i*8 + 4;
var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
  var forecastDay = forecastDate.getDate();
  var forecastMonth = forecastDate.getMonth() + 1;
 var forecastYear = forecastDate.getFullYear();
 var forecastDate = document.createElement("p");
               
 forecastDate.setAttribute("class","mt-3 mb-0 forecast-date");
forecastDate.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
 forecast[i].append(forecastDate);
                
 var forecastWeather = document.createElement("img");
 forecastWeather.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
 forecastWeather.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
forecast[i].append(forecastWeather);
                
 var forecastTemp = document.createElement("p");
 forecastTemp.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
forecast[i].append(forecastTemp);
 var forecastHumidity = document.createElement("p");
 forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
forecast[i].append(forecastHumidity);
 }
  })
 });  
 }

 search.addEventListener("click",function() {
 var searchTerm = input.value;
 getWeather(searchTerm);
searchHistory.push(searchTerm);
 localStorage.setItem("search",JSON.stringify(searchHistory));
 renderSearchHistory();
  })

  clear.addEventListener("click",function() {
 searchHistory = [];
  renderSearchHistory();
 })

 function k2f(K) {
 return Math.floor((K - 273.15) *1.8 +32);
 }

  function renderSearchHistory() {
 history.innerHTML = "";
 for (var i=0; i<searchHistory.length; i++) {
 var historyItem = document.createElement("input");
 // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>

historyItem.setAttribute("type","text");
 historyItem.setAttribute("readonly",true);
 historyItem.setAttribute("class", "form-control d-block bg-white");
 historyItem.setAttribute("value", searchHistory[i]);
 historyItem.addEventListener("click",function() {
 getWeather(historyItem.value);
     })
   history.append(historyItem);
  }
 }

renderSearchHistory();
 if (searchHistory.length > 0) {
  getWeather(searchHistory[searchHistory.length - 1]);
    }


//  Saves user's requests

