let lat;
let long;

// Map API Initialization Code
function setUpClickListener(map) {
  map.addEventListener('tap', (event) => {
    let coord = map.screenToGeo(event.currentPointer.viewportX,
            event.currentPointer.viewportY);

    lat = coord.lat.toFixed(2);
    long = coord.lng.toFixed(2);
  });
}

var platform = new H.service.Platform({
  app_id: 'DemoAppId01082013GAL',
  app_code: 'AJKnXv84fjrb0KIHawS0Tg',
  useCIT: true,
  useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat: 40, lng: 0 },
  zoom: 2.6
});

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

setUpClickListener(map);

/*
function buildGuardianQuery (response) {
  let dataArray = [];
  let searchQuery = 'https://content.guardianapis.com/search?q=';

  if (response.address.city) {
    dataArray.push(response.address.city);
  }
  if (response.address.county) {
    dataArray.push(response.address.county);
  }
  if (response.address.state) {
    dataArray.push(response.address.state);
  }

  dataArray.forEach(data => {
    searchQuery += (data + '%20AND');
  });

  return searchQuery += '&api-key=' + process.env.guardianKey;
}
*/

function buildServerRequest(response) {
  let url = 'https://interactive-news-map.herokuapp.com/newsquery?';

  if (response.address.city) {
    url += 'city=' + response.address.city +'&';
  }
  if (response.address.county) {
    url += 'county=' + response.address.county + '&';
  }
  if (response.address.state) {
    url += 'state=' + response.address.state;
  }

  return url;
}



function populateQueryResults (queryJSON) {
  let dataArray = queryJSON.response.results;
  let resultsColumn = document.querySelector('.resultsColumn');

  for (let i = 0; i < dataArray.length; i++) {
    let newResult = document.createElement('div');
    let newResultLink = document.createElement('p')
    let newResultDate = document.createElement('p');

    newResultLink.innerHTML = '<a href=\'' + dataArray[i].webUrl + '\'>' +
                        dataArray[i].webTitle + '</a>';
    newResultDate.textContent = dataArray[i].webPublicationDate.slice(0,10);

    newResultLink.classlist += 'storyName';
    newResultDate.classlist += 'storyDate';

    newResult.appendChild(newResultLink);
    newResult.appendChild(newResultDate);
    resultsColumn.appendChild(newResult);
  }
}


document.querySelector('.clickerino').addEventListener('click', () => {
  if (!lat || !long) {
    alert('No latitude or longitude set yet!');
    return;
  }

  fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + long)
    .then(response => response.json())
    .then(response => {
      return fetch(buildServerRequest(response));
    })
    .then(response => response.json())
    .then(response => {
      populateQueryResults(response);
    });
});
