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



//
document.querySelector('.clickerino').addEventListener('click', () => {
  if (!lat || !long) {
    alert('No latitude or longitude set yet!');
    return;
  }

  fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + long)
    .then(response => response.json())
    .then(response => {
      document.querySelector('.city').textContent = response.address.city;
      document.querySelector('.suburb').textContent = response.address.suburb;

      console.log(response.address);
    });
});
