
var defaultLoc = {
  lat: 40.36,
  lng: -113.10
};

var map;
var flightPath;
var flightPlanCoords = [];
var telemetry;
var markers = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

flightPath = {};


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: defaultLoc,
    // Default location is SLC
    // parseTelemetry centers the map around the boundaries of the coords
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

//  Trying to add the markers here
  for (var i = 0; i < flightPlanCoords.length; i++) {
    var data = flightPlanCoords[i]
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng (data[0], data[1]),
      map: map,
      title: 'test',
    });
  }
} // end initMap

function parseTelemetry(data) {
  var result = [];
  var pattern = /(\s+)/;
  // Take everything after the header row
  if (!(data.indexOf("HEADING") > -1)) {
    alert("Please use entire  dataset (including headings)");
    return "0";
    return false;
  }
  data = data.split("HEADING");
  data = data[1];
  data = data.split(pattern);
  var x = 0,
      j = 0;
  for (var i = 0; i < data.length; i++) {
    if (!(pattern.test(data[i]) || data[i] === "")) {
      if (j == 0) {
        result[x] = {};
        result[x].gmt = data[i];
        j++;
      } else if (j == 1) {
        result[x].lat = Number(data[i]).toFixed(4) - 0;
        j++;
      } else if (j == 2) {
        result[x].lng = (-Number(data[i]).toFixed(4)) - 0;
        j++;
      } else if (j == 3) {
        result[x].heading = Number(data[i]).toFixed(2) - 0;
        x++;
        j = 0;
      }
    }
  }
  return result;
} // End parseTelemetry

function setMapArea(data) {
  var latLngList = [];
  for (var i = 0; i < data.length; i++) {
    latLngList.push(new google.maps.LatLng (data[i].lat,data[i].lng));
  }

  var bounds = new google.maps.LatLngBounds ();

  for (var i = 0, LtLgLen = latLngList.length; i < LtLgLen; i++) {
    bounds.extend (latLngList[i]);
  }
  map.fitBounds(bounds);
  map.setZoom(map.zoom + 1);

  //labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;

  for(var i = 0; i < markers.length; i++){
    markers[i].setMap(null);
  }

  markers = [];
  for (var i = 0; i < telemetry.length; i++) {
    var data = flightPlanCoords[i]
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng (telemetry[i].lat, telemetry[i].lng),
      map: map,
      label: labels[i],
      title: 'test' + i
    });
    markers.push(marker);
  }

  if (typeof flightPath == "object" && typeof flightPath.latLngs !== "undefined") {
    flightPath.setMap(null);
  }

  flightPath = new google.maps.Polyline({
    path: telemetry,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
} // End setMapArea

function generateTable(data,labels){
  var s;
  var d = new Date()
  var dt = (d.getTimezoneOffset() / 60.) * - 1 ; // western hemisphere.
  var localTime = new Date();



  for (var i = 0; i < data.length; i++) {
    //localTime.setHours(d.getHours() - dt);
    s = s + "<tr><td>" + labels[i] + "</td><td>" + data[i].gmt + "</td><td>" + data[i].lat + "</td><td>" + data[i].lng + "</td></tr>";
  }

  $('#dataTable').html(s);
  $('#dt').text(dt);
} // End generateTable



$(document).ready(function(){
  //$('#mapPanel').hide();  // if enabled won't render the map correctly.
  $('#dataPanel').hide();

  initMap();
  // $.ajax({
  //   url : "nav120100.txt",
  //   dataType: "text",
  //   success : function (data) {
  //     telemetry = parseTelemetry(data);
  //     setMapArea(telemetry);
  //   }
  // });

  $('#getTelemetry').on('submit', function(e){
    e.preventDefault();
    // asciiData = $(this).find('textarea').val();
    telemetry = parseTelemetry($(this).find('textarea').val());
    if (telemetry !== "0") {
      setMapArea(telemetry);
      generateTable(telemetry,labels)

      //$('#mapPanel').show();
      $('#dataPanel').show();

    }
  });


});
