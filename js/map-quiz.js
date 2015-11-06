/*!
* map-quiz.js by seneka77
* game control of the location European cities quiz webpage
* Copyright 2015 Snk corp.
*/
var kms = 1500;var cities=0; var score = 0; // score, current-city vars
var txt; // text var
var maxCities; // maximum cities for the game 
var goal; // city goal 
var start, restart; // buttons vars
var distance; // distance between marker and goal
var myLine, myGoal; // store line and circle to the city goal
var lowScore; // hall of fame lowest score
document.getElementById("cities-score").innerHTML = score + " " + "ciudades situadas correctamente";
document.getElementById("kms-score").innerHTML = kms + " " + "kilómetros de margen"; 
start = document.getElementById("startBtn");
start.addEventListener("click", startGame);
function startGame() {
$(document).ready(function(){
    $.getJSON("js/capitalCities.json", function(result){  
		$.each(result, function(i, field){
        $("#current-city").text('"' + field[cities].capitalCity.toString() + '"');
		goal=new google.maps.LatLng(field[cities].lat,field[cities].long);
		maxCities= field.length;
        });
    });
});
document.getElementById("gameStatus").innerHTML = ' <button id="placeBtn" class="btn"  > comprobar &nbsp;<i class="icon-search"></i></button> ' ; //style="float":right; margin-right: 490px 
start = document.getElementById("placeBtn");
start.addEventListener("click", checkLocation);
}
function loadHallOfFame(){
var maxPLayers;
var topPlayers;
$(document).ready(function(){
    $.getJSON("js/hallOfFame.json", function(result){  
		$.each(result, function(i, field){
        $("#top-1").html('<td> ' + field[0].name.toString() + '</td>' + '<td> ' + field[0].cities.toString() + '</td>' + '<td> ' + field[0].kms.toString() + '</td>' + '<td> ' + field[0].date.toString() + '</td>' );
		$("#top-2").html('<td> ' + field[1].name.toString() + '</td>' + '<td> ' + field[1].cities.toString() + '</td>' + '<td> ' + field[1].kms.toString() + '</td>' + '<td> ' + field[1].date.toString() + '</td>' );
		$("#top-3").html('<td> ' + field[2].name.toString() + '</td>' + '<td> ' + field[2].cities.toString() + '</td>' + '<td> ' + field[2].kms.toString() + '</td>' + '<td> ' + field[2].date.toString() + '</td>' );
		$("#top-4").html('<td> ' + field[3].name.toString() + '</td>' + '<td> ' + field[3].cities.toString() + '</td>' + '<td> ' + field[3].kms.toString() + '</td>' + '<td> ' + field[3].date.toString() + '</td>' );
		$("#top-5").html('<td> ' + field[4].name.toString() + '</td>' + '<td> ' + field[4].cities.toString() + '</td>' + '<td> ' + field[4].kms.toString() + '</td>' + '<td> ' + field[4].date.toString() + '</td>' );
		$("#top-6").html('<td> ' + field[5].name.toString() + '</td>' + '<td> ' + field[5].cities.toString() + '</td>' + '<td> ' + field[5].kms.toString() + '</td>' + '<td> ' + field[5].date.toString() + '</td>' );
		$("#top-7").html('<td> ' + field[6].name.toString() + '</td>' + '<td> ' + field[6].cities.toString() + '</td>' + '<td> ' + field[6].kms.toString() + '</td>' + '<td> ' + field[6].date.toString() + '</td>' );
		$("#top-8").html('<td> ' + field[7].name.toString() + '</td>' + '<td> ' + field[7].cities.toString() + '</td>' + '<td> ' + field[7].kms.toString() + '</td>' + '<td> ' + field[7].date.toString() + '</td>' );
		$("#top-9").html('<td> ' + field[8].name.toString() + '</td>' + '<td> ' + field[8].cities.toString() + '</td>' + '<td> ' + field[8].kms.toString() + '</td>' + '<td> ' + field[8].date.toString() + '</td>' );
		$("#top-10").html('<td> ' + field[9].name.toString() + '</td>' + '<td> ' + field[9].cities.toString() + '</td>' + '<td> ' + field[9].kms.toString() + '</td>' + '<td> ' + field[9].date.toString() + '</td>' );
		maxPlayers= field.length;
		topPlayers = field;
		topPlayers = eval(topPlayers);
		lowScore= field[9];
		//alert(lowScore.name.toString());
		//alert(maxPlayers);
		//alert(topPlayers[0].name.toString());
        });
    });
});
}
function checkLocation() {
var live =0; // flag if continue playing
var diff; // store kms left, aux var, useless
if (markers.length == 0) { // no markers on map
	document.getElementById("gameInfo").innerHTML = "Pulsa el botón de comprobar sólo cuando hayas colocado el marcador adecuadamente";
} else {
map.setZoom(6);
map.setCenter(goal);
myGoal = new google.maps.Circle({
  center:goal,
  radius:50000,
  strokeColor:"red",
  strokeOpacity:0.2,
  strokeWeight:2,
  fillColor:"orange",
  fillOpacity:0.4
  });
myGoal.setMap(map);
myLine = new google.maps.Polygon({
    fillColor:"red",
    fillOpacity:0.2,
	fillWeight:1,
	paths: [
      goal,
      markers[markers.length-1].position,     
    ]
  });
myLine.setMap(map);
distance = google.maps.geometry.spherical.computeDistanceBetween(goal,markers[markers.length-1].position);
document.getElementById("gameStatus").innerHTML = "Quedaste a "+ (distance / 1000).toFixed(3) +" kilómetros de tu objetivo" ; 
var diff = (kms - (distance/1000)); // remember to convert distnce to kms
kms=diff.toFixed(3); 
if (cities == maxCities-1) { // finish game, locate all the cities
	cities++;
	if (distance <= 50000) { // last city scored
		txt= "¡¡Enhorabuena!! Acertaste la última ciudad del juego " + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="refresh"></i></button> ';
		score++;
		checkScore();// check hi-score
	} else { // miss last city location
		txt="¡¡Felicidades!! Completaste el juego " + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="refresh"></i> </button> ';
		checkScore();// check hi-score
	}
} else {
	cities++;
	if ((distance <= 50000) && (kms >= 0)){ // complete success
		txt= "¡¡Bien hecho!! Situaste correctamente la ciudad " + '<button id="nextBtn" class="btn" > Siguiente ciudad &nbsp;<i class="icon-step-forward"></i></button> ';
		score++; live++;
	} else if ((distance <= 50000) && (kms < 0)) { // city scored, but no kms left... game over
		txt= "¡¡Buen trabajo!! Acertaste pero ya te quedaste sin margen de kilómetros para seguir. FIN " + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="icon-refresh"></i></button> ';
		score++;
		checkScore();// check hi-score 
	} else if ((distance > 50000) && (kms > 0)) { // city fail, still kms left, game continues 
		txt= "¡¡Fallaste!! Suerte en la próxima localización " + '<button id="nextBtn" class="btn" > Siguiente ciudad &nbsp;<i class="icon-step-forward"></i></button> ';
		live++;
	} else {  // no kms left, game over
		txt= "Lo sentimos. Te quedaste sin margen de kilómetros. FIN " + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="icon-refresh"></i></button> ';
		checkScore();// check hi-score
	}
}	
document.getElementById("gameInfo").innerHTML = txt;
document.getElementById("cities-score").innerHTML = score + " " + "ciudades bien colocadas, quedan: " + (maxCities-cities);
document.getElementById("kms-score").innerHTML = kms + " " + "kilómetros de margen"; 
if (live) {
	start = document.getElementById("nextBtn");
	start.addEventListener("click", clearGame);
} else {
	restart = document.getElementById("restartBtn");
	restart.addEventListener("click", reloadGame);
	}
}	
}
function reloadGame() {
//document.getElementById("gameInfo").innerHTML = 'Dentro de la función reload';
//history.go(0);
window.location.reload();
}
function clearGame() {
document.getElementById("gameInfo").innerHTML = " ";
map.setZoom(3);
map.setCenter(myCenter);
myGoal.setMap(null);
myLine.setMap(null);
startGame();
}
function getName() {
var top = document.getElementById("i-name").value;
localStorage.setItem("name", top);
}
function getDate(){
var date = new Date();
//var datestring = ('0000' + date.getFullYear()).slice(-4) + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + 'T'+  ('00' +  date.getHours()).slice(-2) + ':'+ ('00' + date.getMinutes()).slice(-2) +'Z';
return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
}
function checkScore() {
if (typeof(Storage) !== "undefined") {
    // Check
    if ((localStorage.getItem("cities") < score) || ((localStorage.getItem("cities") == score) && (localStorage.getItem("kilometers") < kms))) { // session best
		document.getElementById("new-hi").innerHTML = "¡¡Nuevo record de esta sesión!!";
		document.getElementById("score-form").innerHTML = '<form id = "f-name" action=""> Nombre: <input id="i-name" type="text" name="i-name"  pattern=".{3,}"  required title="Escribe entre 3-9 caracteres" maxlength="9"> <button class="btn" id="getNameBtn" onclick="getName()" > Salvar &nbsp;<i class="icon-user"></i></button> </form> ';
		// Store
		localStorage.setItem("cities", score);
		localStorage.setItem("kilometers", kms);
		localStorage.setItem("date", getDate());
		var iname = document.getElementById("i-name").value;
		localStorage.setItem("name", iname);
		document.getElementById("gameInfo").innerHTML = iname; // ??
    } 
} else {
    document.getElementById("hi-score").innerHTML = "Lo siento, no hay ranking de sesión ya que tu navegador no soporta almacenamiento web...";
}
}
//Check browser support
if (typeof(Storage) !== "undefined") {
  if (localStorage.getItem("name") == null) {  
   // Store something
   localStorage.setItem("name", "Snk");
   localStorage.setItem("cities", "0");
   localStorage.setItem("kilometers", "0");
   localStorage.setItem("date", getDate());
   }
    // Retrieve
  document.getElementById("hi-score").innerHTML =  "MEJOR PUNTUACIÓN DE ESTA SESIÓN";
  document.getElementById("score-row").innerHTML = '<td> ' +"NOMBRE" +  '</td> <td> ' + "CIUDADES"+ '</td> <td> ' + "KILÓMETROS"+ '</td> ' + '</td> <td> ' + "FECHA"+ '</td> ';
  document.getElementById("top-scorer").innerHTML = '<td> ' + localStorage.getItem("name") + '</td> <td> ' + localStorage.getItem("cities") + '</td> <td> '+ localStorage.getItem("kilometers")+'</td> ' + '<td  > '+ localStorage.getItem("date")+'</td> ';
  
  } else {
  document.getElementById("hi-score").innerHTML = "Lo siento, no hay ranking ya que tu navegador no soporta almacenamiento web...";
}
document.getElementById("hall-fame").innerHTML =  "MEJORES PUNTUACIONES HISTÓRICAS";
document.getElementById("history-row").innerHTML = '<td> ' +"NOMBRE" +  '</td> <td> ' + "CIUDADES"+ '</td> <td> ' + "KILÓMETROS"+ '</td> ' + '</td> <td> ' + "FECHA"+ '</td> ';
loadHallOfFame(); 