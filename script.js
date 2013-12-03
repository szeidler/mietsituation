google.maps.event.addDomListener(window, 'load', initialize);
var map;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(52.50849,13.403637),
    zoom: 12
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  
  loadPoints(fillArray());
}

function fillArray(){
  var dataArray = [
    {"lng" : 52.50849,
    "lat" : 13.403637},
    {"lng" : 52.50849,
    "lat" : 13.403637},
    {"lng" : 52.50849,
    "lat" : 13.403637},
    {"lng" : 52.50849,
    "lat" : 13.403637}
  ];
  return dataArray;
}

function loadPoints(dataArray){
  for (var i = dataArray.length - 1; i >= 0; i--) {
    var latLng = new google.maps.LatLng(dataArray[i].lng, dataArray[i].lat);
    console.log(latLng);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
  };
}