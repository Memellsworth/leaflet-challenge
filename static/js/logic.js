//store our api in an endpoint 
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//create our map 
let myMap = L.map("map", {
  center: [
      37.09, -95.71
  ],
  zoom: 5,
  
});

//adding title layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

//perform get requests 
d3.json(queryUrl).then(function(data){
  //once we get a response process the datwa 
  var earthquakeData = data.features;
  function getColor(depth){
    switch (true) {
      case depth > 90:
          return "7c0a02";
        case depth > 70: 
          return "#e30022"; 
        case depth > 50:
          return "#ff5800";
        case depth > 30:
          return "#ffe135";
        case depth > 10:
          return "#b0bf1a";
        default:
          return "#fe6f5e";
  }
}

//create markers based on magnitude size 
function getMarker (magnitude,depth){
  return{
    radius: magnitude * 4,
    fillColor: getColor(depth),
    color:"grey",
    weight: 1,
    opacity:1
  };
}
//loop through earthquake data to create markets 
earthquakeData.forEach(function(earthquake){
  var coordinates = earthquake.geometry.coordinates;
  var magnitude = earthquake.properties.mag;
  var depth = coordinates[2];
  
  var markerOpt = getMarker(magnitude,depth);
  //create markers with pop up 
  var marker = L.circleMarker([coordinates[1],coordinates[0]],markerOpt).bindPopup(`<h3>${earthquake.properties.place}<h3><hr><p>${new Date(earthquake.properties.time)}</p><hr><p>${earthquake.properties.mag}</p>`).addTo(myMap);
});
var myColors = ["#7c0a02", "#e30022", "#ff5800", "#ffe135", "#b0bf1a", "#fe6f5e"];
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
    categories = ['+90', ' 70-90', ' 50-70', ' 30-50', ' 10-30', '-10-10'];
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            labels.push(
                '<li class="circle" style="background-color:' + myColors[i] + '">' + categories[i] + '</li> '
            );
    }
    div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
    return div;
};
legend.addTo(myMap);
});
