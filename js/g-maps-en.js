/*!
* g-maps-en.js by seneka77
* show map and markers from google maps to the location European cities quiz webpage
* Copyright 2015 Snk corp.
*/
//import "http://maps.google.com/maps/api/js?sensor=false&libraries=geometry"; // required
var myCenter=new google.maps.LatLng(51.508742,14.120850);
var markers =[]; // list of markers
var myStyle = [ { "stylers": [ { "visibility": "off" } ] },{ "featureType": "water", "elementType": "geometry", "stylers": [ { "visibility": "on" } ] } 
				,{ "featureType": "administrative.country", "elementType": "geometry", "stylers": [ { "visibility": "on" } ] } ];
// country borders added
var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeControlOptions: {
		mapTypeIds: ['mystyle', google.maps.MapTypeId.SATELLITE]
		},
    center: myCenter,
    zoom: 3,
    mapTypeId: 'mystyle',
	disableDefaultUI:true,
	zoomControl:true,
	zoomControlOptions: {
	style:google.maps.ZoomControlStyle.SMALL,
	position:google.maps.ControlPosition.LEFT_BOTTOM
	}	 
});
map.mapTypes.set('mystyle', new google.maps.StyledMapType(myStyle, { name: 'My Style' }));
map.setTilt(0);
function initialize()
{ 
google.maps.event.addListener(map,'click', function(event) {
	clearMarkers();
	placeMarker(event.latLng);
  });
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function clearMarkers() {
  setMapOnAll(null);
}
function placeMarker(location) {
    marker = new google.maps.Marker({
    position: location,
    map: map,
	//icon: '../img/marker_flag.png', //icon2-13.PNG' //'/img/green-flag2.PNG',  //marker_flag.png',
	//shadow: '../img/marker_shadow.png',
  });
//var infowindow = new google.maps.InfoWindow({
//    content: 'Latitud: ' + location.lat() + '<br>Longitud: ' + location.lng() });
//infowindow.open(map,marker); -->
markers.push(marker);
// document.getElementById("kms-score").innerHTML = kms + " " + "kilometers left"; 
}  
}
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '470px';
    mapdiv.style.height = '330px';
  }
}
detectBrowser();
google.maps.event.addDomListener(window, 'load', initialize);
