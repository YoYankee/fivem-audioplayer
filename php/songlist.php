<?php
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = 'root';
$dbName = 'taichi_songs';

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$action = $_GET['action'];

if ($action === 'getPlaylist') {
  $playlist = array();
  $sql = "SELECT * FROM list ORDER BY id";
  $result = $conn->query($sql);
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $song = array(
        'name' => $row['name'],
        'url' => $row['url']
      );
      array_push($playlist, $song);
    }
  }

  echo json_encode($playlist);
}

// Close the database connection
$conn->close();
?>
