#  save.php

iFractions is developed to run mainly on the client side. However, it communicates with a MySQL database to save info about the player's progress after each level. There's a PHP file called **save.php** that manages the connection between the game and the database. Also, the asynchronous communication is stablished using **XMLHTTPRequest**.

# How to set up the database connection correctly

First you'll need a MySQL database installed on the server (more info in https://www.mysql.com).

Now, in order for iFractions to successfully establish a connection to the database you must:

1. create and set up the database for the game.
2. update /php/save.php 
3. update /js/globals.js

## 1) Creating the database for iFractions

Considering the database name to be **db_ifractins** and the table to be **ifractions**, you can setup the MySQL database as follows:

	CREATE DATABASE db_ifractions;

	USE db_ifractions;

	CREATE TABLE ifractions (
		line_id int(11) NOT NULL AUTO_INCREMENT,
		line_hostip varchar(255) DEFAULT NULL,
		line_playername varchar(256) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_datetime varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_lang varchar(6) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_game varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_mode varchar(1) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_operator varchar(5) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_level int(5) NOT NULL,
		line_mappos int(5) NOT NULL,
		line_result varchar(6) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_time varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		line_details varchar(120) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		PRIMARY KEY (line_id)
	) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = latin1;

Note that each column has the prefix **line_**.

## 2) /php/save.php

You have to set values for the following variables in **/php/save.php** to match the database's:

	$servername = "localhost"; 	// INSERT MySQL server
	$username = "put_username";	// INSERT MySQL user name
	$password = "put_password";	// INSERT MySQL password
	$dbname = "db_ifractions";	// INSERT database name (default=db_ifractions) 
	$tablename = "ifractions";	// INSERT table name (default=ifractions)

## 3) /js/globals.js

Inside **/js/globals.js** there's a global function called **sendToDB()**. When the player's information is collected after each game, the game file sends it as a parameter to **sendToDB()**. It makes an asynchronous call to **/php/save.php**, that executes the connection to the database.

	const data = 'line_ip='// INSERT the IP of the machine where the MySQL was set up
		+ '&line_name=' + // player's name
		+ '&line_lang=' + // selected language for the game
		+ // data received from the game as parameter to this function


# Where do we use the database in the code?

There is a function **postScore()** in every game file:
* /js/squareOne.js
* /js/squareTwo.js
* /js/circleOne.js

After each level is completed (with the player's answer being correct or not), before going back to the level map, the function **postScore()**, is called. It joins all the player's progress information into a string (as can be seen below), that is sent as a parameter to **sendToDB()**, from **/js/globals.js**, that sends it to the database.

	const data = '&line_game=' + // collect game shape
	+ '&line_mode=' + // collect game mode type
	+ '&line_oper=' + // collect game math operation type
	+ '&line_leve=' + // collect the selected difficulty for the game
	+ '&line_posi=' + // collect the players position on the map
	+ '&line_resu=' + // collect status for players answer (correct or incorrect)
	+ '&line_time=' + // collect time spent finishing the game
	+ '&line_deta=' + // collect extra details specific to current game