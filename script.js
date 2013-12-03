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
    "lat" : 13.403637,
    "mag" : 1
    },
    {"lng" : 52.591369,
    "lat" : 13.434691,
    "mag" : 2.2
    }
  ];
  return dataArray;
}

function loadPoints(dataArray){
  var heatmapData = [];
  for (var i = dataArray.length - 1; i >= 0; i--) {
    var latLng = new google.maps.LatLng(dataArray[i].lng, dataArray[i].lat);
    var magnitude = dataArray[i].mag;
    var weightedLoc = {
      location: latLng,
      weight: Math.pow(2, magnitude)
    };
    heatmapData.push(weightedLoc);
    console.log(latLng);
  }
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    dissipating: false,
    map: map
    });
}
