/*!
* map-quiz.js by seneka77
* game control of the location European cities quiz webpage
* Copyright 2015 Snk corp.
*/
var kms = 1500;var cities=0; var score = 0; // score, current-city vars
//var txt; // text var
var maxCities; // maximum cities for the game 
var goal; // city goal 
var start; // buttons vars
var distance; // distance between marker and goal
var myLine, myGoal; // store line and circle to the city goal
var lowScore; // hall of fame lowest score
var maxPLayers; // hall of fame places
//var topPlayers; // hal of fame JSON data type
var topGlobal; // actual top gamer
var topB = 0; // boolean, define if enter on the hall of fame
var hallJson; // JSON var hall of fame
checkStorage();
loadHallOfFame();
document.getElementById("cities-score").innerHTML = score + " " + "ciudades situadas correctamente";
document.getElementById("kms-score").innerHTML = kms + " " + "kilómetros de margen"; 
start = document.getElementById("startBtn");
start.addEventListener("click", startGame);
//if (-4.77 < -6.78) alert("-4 < -6");

function clearGame() {
document.getElementById("gameInfo").innerHTML = "";
map.setZoom(3);
map.setCenter(myCenter);
myGoal.setMap(null);
myLine.setMap(null);
start.removeEventListener ("click", clearGame, false);
startGame();
return false;
}
function reloadGame() {
//document.getElementById("gameInfo").innerHTML = 'Dentro de la función reload';
//history.go(0);
start.removeEventListener ("click", reloadGame, false);
window.location.reload();
return false;
}
function checkLocation() {
var live =0; // flag if continue playing
var diff; // store kms left, aux var, useless
var txt; // text var
var distance; // distance between marker and goal
if (markers.length == 0) { // no markers on map
	document.getElementById("gameInfo").innerHTML = "Pulsa el botón de comprobar sólo cuando hayas colocado el marcador adecuadamente";
} else {
map.setZoom(6);
map.setCenter(goal);
myGoal = new google.maps.Circle({
  center:goal,
  radius:50001,
  strokeColor:"red",
  strokeOpacity:0.2,
  strokeWeight:2,
  fillColor:"orange",
  fillOpacity:0.4
  });
myGoal.setMap(map);
myLine = new google.maps.Polygon({
    fillColor:"brown",
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
var diff = (kms - (distance/1000)); // remember to convert disatnce to kms
kms=diff.toFixed(3); 
if (cities == maxCities-1) { // finish game, locate all the cities
	cities++;
	if (distance <= 50000) { // last city scored
		txt= "¡¡Enhorabuena!! Acertaste la última ciudad del juego "; // + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="refresh"></i></button> ';
		score++;
		checkScore();// check hi-score
	} else { // miss last city location
		txt="¡¡Felicidades!! Completaste el juego "; // + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="refresh"></i> </button> ';
		checkScore();// check hi-score
	}
} else {
	cities++;
	if ((distance <= 50000) && (kms >= 0)){ // complete success
		txt= "¡¡Bien hecho!! Situaste correctamente la ciudad " + '<button id="nextBtn" class="btn" > Siguiente ciudad &nbsp;<i class="icon-step-forward"></i></button> ';
		score++; live++;
	} else if ((distance <= 50000) && (kms < 0)) { // city scored, but no kms left... game over
		txt= "¡¡Buen trabajo!! Acertaste pero ya te quedaste sin margen de kilómetros para seguir. FIN "; // + '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="icon-refresh"></i></button> ';
		score++;
		checkScore();// check hi-score 
	} else if ((distance > 50000) && (kms > 0)) { // city fail, still kms left, game continues 
		txt= "¡¡Fallaste!! Suerte en la próxima localización " + '<button id="nextBtn" class="btn" > Siguiente ciudad &nbsp;<i class="icon-step-forward"></i></button> ';
		live++;
	} else {  // no kms left, game over
		txt= "Lo sentimos. Te quedaste sin margen de kilómetros. FIN "; //+ '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="icon-refresh"></i></button> ';
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
	//restart = document.getElementById("restartBtn");
	//restart.addEventListener("click", reloadGame);
	}
}	
}
function startGame() {
$(document).ready(function(){
    $.getJSON("../js/capitalCities-es.json", function(result){  
		$.each(result, function(i, field){
        $("#current-city").text('"' + field[cities].capitalCity.toString() + '"');
		goal=new google.maps.LatLng(field[cities].lat,field[cities].long);
		maxCities= field.length;
        });
    });
});
	document.getElementById("gameStatus").innerHTML = ' <button id="placeBtn" class="btn"  > comprobar &nbsp;<i class="icon-search"></i></button> ' ; //style="float":right; margin-right: 490px 
	start = document.getElementById("placeBtn");
	start.addEventListener("click",checkLocation);
}
function loadHallOfFame() {
//'use strict'; // advice from Javascript validator
$(document).ready(function(){
    $.getJSON("../js/hallOfFame.json", function(result){  // file : hallOfFame.json 
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
		//topPlayers = field;
		//topPlayers = eval(topPlayers); // converts to JSON format
		lowScore= field[9];
		//console.log(topPlayers);
		console.log(result);
		hallJson = result;
		//field[9].name.value = "Ylena2";
		//alert(field[8].name);
		//alert(maxPlayers);
		//alert(topPlayers[0].name.toString());
        });
    });
});
}
function getName(b) {
topGlobal = document.getElementById("i-name").value;
if ((topGlobal.length >= 3) && (topGlobal.length <= 13)) { // valid player name
// Store
localStorage.setItem("name", topGlobal);
localStorage.setItem("cities", score);
localStorage.setItem("kilometers", kms);
localStorage.setItem("date", getDate());
$("#getNameButton").click(function(event) {
    event.stopImmediatePropagation();
    return(false);
});
if (b) { // enter the Hall of Fame
	
	storeRecord(topGlobal); // store player in the hall of fame
	}
} else return false;
}
function getNameGlobal() {
topGlobal = document.getElementById("g-name").value;
if ((topGlobal.length >= 3) && (topGlobal.length <= 13)) { // valid player name
//localStorage.setItem("name", top);
$("#getNameButton").click(function(event) {
    event.stopImmediatePropagation();
    return(false);
});
storeRecord(topGlobal); // store player in the hall of fame
} else return false;
}
function getDate(){
var date = new Date();
//var datestring = ('0000' + date.getFullYear()).slice(-4) + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + 'T'+  ('00' +  date.getHours()).slice(-2) + ':'+ ('00' + date.getMinutes()).slice(-2) +'Z';
return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
}
function isLess(a,b) { // string compare
var isLess = 0;
isLess = (Number(a) <  Number(b)).valueOf();
return isLess;
}
function storeRecord(name) {
var pos = 8; // we know the score is higher than the last (10th place, 9th if we consder 0th place the best)
var placed = 0; // define if record is correctly placed (if found the correct position on the hall of fame)
//restart = document.getElementById("close");
//restart.addEventListener("click", reloadGame());
//alert(kms + " " + score);
while (!placed) {	
	if ((hallJson.hallOfFame[pos].cities < score) || (hallJson.hallOfFame[pos].cities == score) && (isLess(hallJson.hallOfFame[pos].kms, kms))) { // better than actual checking place
		//topPlayers[pos+1].cities = topPlayers[pos].cities;
		hallJson.hallOfFame[pos+1].cities = hallJson.hallOfFame[pos].cities;
		hallJson.hallOfFame[pos+1].kms = hallJson.hallOfFame[pos].kms;
		hallJson.hallOfFame[pos+1].name = hallJson.hallOfFame[pos].name;
		hallJson.hallOfFame[pos+1].date = hallJson.hallOfFame[pos].date;
		if (pos > 0)
			pos--;
		else { // 1st place
			//topPlayers[pos].cities = score;
			hallJson.hallOfFame[pos].cities= score.toString(); 
			hallJson.hallOfFame[pos].kms= kms;
			hallJson.hallOfFame[pos].date= getDate();
			hallJson.hallOfFame[pos].name= name;
			//topPlayers[pos].kms = kms;
			//topPlayers[pos].name = name;
			//topPlayers[pos].date =getDate();
			placed = 1;
	    }
	} else { // found the correct place
	   hallJson.hallOfFame[pos+1].cities = score.toString();
	   hallJson.hallOfFame[pos+1].kms = kms;
	   hallJson.hallOfFame[pos+1].name = name;
	   hallJson.hallOfFame[pos+1].date =getDate();
	   placed = 1;
	}
}
console.log(hallJson);
$(document).ready(function(){
	$.ajax({
		type: "POST",
		dataType: "json",
		async : false,
		url: "actualiza-ranking.php", //Relative or absolute path to response.php file
		data: hallJson,
		success: function(data) {
			//console.log("Form submitted successfully.Returned json: " + data["json"]);
			console.log("Actualizada la tabla de mejores puntuaciones históricas");
	}
	});
});
//alert("Actualizada la tabla de mejores puntuaciones históricas");
showModal();
}
function showModal() {
   $("#myModal").modal("toggle");//$("#myModal").modal('show');
}
function myFunctionName() {
    if (document.myForm.iname.value == '')
        return false;
    else
        return true;
}
function checkScore() {
//var topB = 0; // boolean, define if enter on the hall of fame
var restart; // button var
if (typeof(Storage) !== "undefined") {
    // Check
	//alert(localStorage.getItem("kilometers"));alert(kms);
    //alert((localStorage.getItem("cities") < score));
	//alert( ((localStorage.getItem("cities") == score) && (localStorage.getItem("kilometers") < kms))) ;
	if ((localStorage.getItem("cities") < score) || 
		((localStorage.getItem("cities") == score) && (isLess(localStorage.getItem("kilometers"), kms)))) { // session best
		if ((lowScore.cities < score) || ((lowScore.cities == score) && (isLess(lowScore.kms, kms)))) { // enter on the hall of fame
		  document.getElementById("new-hi").innerHTML = "¡¡Nuevo record de todos los tiempos y de esta sesión!!";
		  topB = 1;
		} else  document.getElementById("new-hi").innerHTML = "¡¡Nuevo record de esta sesión!!";
		document.getElementById("score-form").innerHTML = '<form NAME="myForm" onSubmit="return myFunctionName()" > <div class="input-append"> <input id="i-name" type="text" placeholder="Nombre..." name="iname"  pattern=".{3,}"  required title="Escribe entre 3-13 caracteres" maxlength="13"> <button class="btn" id="getNameBtn" data-loading-text="Salvando..." onclick="getName(topB)" > Salvar &nbsp;<i class="icon-user"></i></button> </div></form> ';
		//document.getElementById("score-form").innerHTML = '<form id = "f-name" action=""> Nombre: <input id="i-name" type="text" name="i-name"  pattern=".{3,}"  required title="Escribe entre 3-9 caracteres" maxlength="9"> <button class="btn" id="getNameBtn" data-loading-text="Salvando..." onclick="getName(topB)" > Salvar &nbsp;<i class="icon-user"></i></button> </form> ';
		//$("#restartBtn").prop('disabled', true);// deactivate restart button
		// Store
		/*localStorage.setItem("cities", score);
		localStorage.setItem("kilometers", kms);
		localStorage.setItem("date", getDate());
		iname = document.getElementById("i-name").value;
		localStorage.setItem("name", iname);
		document.getElementById("gameInfo").innerHTML = iname; // ?? */
    } 
	//alert(top);alert(score);alert(kms);
	if ((lowScore.cities < score) || ((lowScore.cities == score) && (isLess(lowScore.kms, kms)))) { // enter on the hall of fame
		  if (topB==0) { // not detected before
		    //$("#restartBtn").prop('disabled', true);// deactivate restart button
		    topB = 1; // not neccessary, anyway
			document.getElementById("new-hi").innerHTML = "¡¡Nuevo record de todos los tiempos!!";
		    document.getElementById("score-form").innerHTML = '<form id = "f-name" NAME="myForm" onSubmit="return myFunctionName()"> <input id="g-name" type="text" placeholder="Nombre..." name="i-name"  pattern=".{3,}"  required title="Escribe entre 3-13 caracteres" maxlength="13"> <button class="btn" id="getNameBtn" data-loading-text="Salvando..." onclick="getNameGlobal()" > Salvar &nbsp;<i class="icon-user"></i></button> </form> ';
		    //var gname = document.getElementById("i-name").value;
		    
			} //else storeRecord(topGlobal); // store player in the hall of fame
			//alert("Check score");alert (gname);alert(topGlobal);	
	} else { // no hi-scores
		document.getElementById("score-form").innerHTML = '<button id="restartBtn" class="btn" > Reiniciar juego &nbsp;<i class="icon-refresh"></i></button> ';
		restart = document.getElementById("restartBtn");
		restart.addEventListener("click", reloadGame);
	}
} else {
    document.getElementById("hi-score").innerHTML = "Lo siento, no hay ranking de sesión ya que tu navegador no soporta almacenamiento web...";
}
}
function checkStorage() {
//Check WebStorage browser support
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
//loadHallOfFame(); 
}
