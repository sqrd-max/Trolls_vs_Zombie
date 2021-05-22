<?php

$conn = new PDO('mysql:host=localhost;dbname=trolls_zombie;charset=utf8', 'root', '', array(
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
));

$username = $_POST['username'];
$score = $_POST['score'];
$time = $_POST['time'];

$insert = $conn->prepare('INSERT INTO ranking(`username`, `score`, `time`) VALUES (?, ?, ?)');
$insert->execute([
    (string) $username,
    (int) $score,
    (int) $time
]);

$select = $conn -> query('SELECT * FROM ranking ORDER BY `score` DESC LIMIT 10');
echo json_encode($select->fetchAll());