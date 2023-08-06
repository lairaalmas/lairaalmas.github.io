<?php
// LInE - Free Education, Private Data
//
// This PHP must be used if you intend to register in MySQL server the students interactions.
// Adjust the names here and those in your MySQL server.
//
// The following files make reference to the table fields (must use the same names "line_id, line_name, ...")
// @see js/globals.js
// @see js/circleOne.js
// @see js/squareOne.js
// @see js/squareTwo.js

// Change these values according to your database settings
$servername = "localhost";  // INSERT MySQL server (e.g "line.ime.usp.br")
$username = "put_username"; // INSERT MySQL user name
$password = "put_password"; // INSERT MySQL password
$dbname = "db_ifractions";  // INSERT database name (default="db_ifractions")

$tablename = "ifractions";  // INSERT table name (default="ifractions")

function remove_accents ($stripAccents) {
  // $stripAccents = preg_replace('/[^\x20-\x7E]/','', $stripAccents); // remove all special characters - if necessary, uncomment it
  return $stripAccents;
}

// Get some information about the client IP
function clientIP () {
  if (getenv("HTTP_CLIENT_IP"))
    $ip = getenv("HTTP_CLIENT_IP");
  elseif (getenv("HTTP_X_FORWARDED_FOR"))
    $ip = getenv("HTTP_X_FORWARDED_FOR");
  elseif (getenv("REMOTE_ADDR"))
    $ip = getenv("REMOTE_ADDR");
  $strIP = $ip;
  $resp = gethostbyaddr($ip);
  if (isset($resp) && strlen($resp)>0) {
    $strIP .= "; " . $resp;
  }
  return $strIP;
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$ip = clientIP();

// /js/globals.js: data = line_ip=120.0.0.1&line_name=name&line_lang=pt_BR
// /js/squareOne.js: data += &line_game=Square&line_mode=A&line_oper=Plus&line_leve=1&line_posi=1&line_resu=true&line_time=3&line_deta=numBlocks:3, valBlocks: 1,1,1, blockIndex: 2, floorIndex: 2;url=php/save.php
$name = $_REQUEST["line_name"];
$date = date("Y-m-d H:i:s");
$lang = $_REQUEST["line_lang"];
$game = $_REQUEST["line_game"];
$mode = $_REQUEST["line_mode"];
$oper = $_REQUEST["line_oper"];
$leve = $_REQUEST["line_leve"];
$posi = $_REQUEST["line_posi"];
$resu = $_REQUEST["line_resu"];
$time = $_REQUEST["line_time"];
$deta = $_REQUEST["line_deta"];

$nameUnchanged = $name; // /js/preMenu.js: playerName

$name = remove_accents($name);

if (is_object($lang))
  $lang = json_decode($lang);

// Table 'ifractions': line_id line_hostip line_playername line_datetime line_lang line_game line_mode line_operator line_level line_mappos line_result line_time line_details
$sql = "INSERT INTO $tablename
(line_hostip, line_playername, line_datetime, line_lang, line_game, line_mode, line_operator, line_level, line_mappos, line_result, line_time, line_details)
VALUES
('$ip', '$name', '$date', '$lang', '$game', '$mode', '$oper', $leve, $posi, '$resu', $time, '$deta')";

// Register in database
if ($conn->query($sql) === TRUE) {
  print "Saved.";
  $result = "OK";
  } else {
  print "Error: " . $sql . "<br>" . $conn->error;
  $result = "Error: " . $conn->error;
}

// DEBUG
$date = date('Y_m_d_H_i_s');
$fp = fopen('../temp/file_' . $date . ".txt", 'w');
fwrite($fp, "name_unchanged=" . $nameUnchanged . ", name=" . $name . "\n" . $sql . "\nResultado: " . $result);
fclose($fp);

$conn->close();

?>