<?php

$conn = new PDO('mysql:host=localhost;dbname=trolls_zombie;charset=utf8', 'root', '', array(
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
));

$username = $_REQUEST['username'];

$select = $conn->prepare('SELECT id FROM ranking WHERE `username` = ?;');
$select->execute([
    (string) $username
]);

echo json_encode(array(
	'exists' => count($select->fetchAll())
));
