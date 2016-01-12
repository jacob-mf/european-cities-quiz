<?php
	if (is_ajax()) {
	if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
	$action = $_POST["action"];
	switch($action) { //Switch case for value of action
	case "test": test_function(); break;
	}
	} else
		topScorers();
	}
	
	//Function to check if the request is an AJAX request
	function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
	}
	
	function test_function(){
	$return = $_POST;
	
	//Do what you need to do with the info. The following are some examples.
	//if ($return["favorite_beverage"] == ""){
	// $return["favorite_beverage"] = "Coke";
	//}
	//$return["favorite_restaurant"] = "McDonald's";
	
	$return["json"] = json_encode($return);
	echo json_encode($return);
	//$json = $_POST['json'];
	}
	function topScorers() {
	$return = $_POST;
	$return["json"] = json_encode($return);
	//$path= "file://js/js-test.txt";
	echo json_encode($return);
	if (json_decode($return['json']) != null) { /* sanity check */
    $file = fopen('/home/www/locate-european-cities-quiz.eu.pn/js/hallOfFame.json','w+') or die("Unable to open fav JSON file");
    fwrite($file, $return['json']);
    fclose($file);
	die("Edit JSON file successfuly");
} else {
    // handle error 
	die("Unable to get Hall of fame JSON record!");
}
	}
?>
