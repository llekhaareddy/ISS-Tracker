// Defines a Leaflet Map object 
const myMap = L.map('myMap').setView([0, 0], 1);

//to use openstreetmap.org products
const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Gets the specific map layer we want from openstreetmap
const tiles = L.tileLayer(tileUrl, { attribution });

// Adds the map layer to myMap
tiles.addTo(myMap);


//Defines an icon to take the place of the standard marker!
const spaceStationIcon = L.icon({iconUrl: 'https://clipart-library.com/img/1817029.png', iconSize: [38, 38]});

//Makes a leaflet marker object
const marker = L.marker([0, 0], {icon: spaceStationIcon})
marker.addTo(myMap)

// The URL we will hit to tell where the iss is
const apiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';

// A boolean to tell whether this is the first time the map has rendered
let firstTime = true;

/* The getISS() function will use the fetch method which accepts the URL of the API as a parameter to request a response to update the data*/
async function getISS(){
	//Makes a request to the apiUrl, and parses the response data
  const response = await fetch(apiUrl);
  const data = await response.json();
  const {
  	latitude,
    longitude
  } = data;
  // Updates the lat/lng of the marker using response data
  marker.setLatLng([latitude, longitude]);
  // sets map location using response data only if it is firstTime, and set firstTime to false
  if (firstTime) {
  	myMap.setView([latitude, longitude]);
    firstTime = false;
  }
  //Sets the text elements in the HTML
  document.getElementById('lat').textContent = latitude;
  document.getElementById('lon').textContent = longitude;
}


// Defines a popup that appears when a user clicks anywhere on the map
var popup = L.popup();

// function opens a popup, informing the user of lat-long
function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(myMap);
}

myMap.on('click', onMapClick);


//Calls getISS function, and sleep for a few seconds before hitting API again
getISS();
setInterval(getISS, 3000);

