/*!
* file-json.js by seneka77 (needs jquery)
* functions to load and save json variables from files
* Copyright Nov-2015 Snk corp.
*/
//var filename; // filename
//var item; // Json object variable
//var a_item; // array variable 1st item of Json
//var item_length; // array variable 1st item of Json
function saveJson(item, filename) {
// show in console parameters
console.log(item); 
console.log(filename);
$(document).ready(function(){
  $.ajax({
	type: "POST",
	//dataType: "json",
	url: "save-json.php", //Relative or absolute path to response.php file
	data: {
		'json' : item,
		'file' : filename},
	//success: function(data) {
	//	console.log("Form submitted successfully. Returned json: " + data["json"]);
	//},
	error: function(jqXhr, textStatus, errorThrown){
                console.log("jqXHR: "  + jqXhr + " textStatus: " + textStatus + " errorThrown: " + errorThrown );
            }
	});
});
return item.length;
}
function loadJson(item, filename) {
// show in console parameters
console.log(item); 
console.log(filename);
$(document).ready(function(){
    $.getJSON(filename, function(result){  
		$.each(result, function(i, field){
			item = result;
			//var item_a= field;
			var item_length = field.length;
	    });
    });
});
// show results
console.log(item_length);
console.log(item); 
//console.log(item_a);
return item_length; 
}
