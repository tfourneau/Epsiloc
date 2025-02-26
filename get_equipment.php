<?php
require_once 'config.php';

$category = isset($_GET['category']) ? $_GET['category'] : '';
$availability = isset($_GET['availability']) ? $_GET['availability'] : '';

$sql = "SELECT * FROM equipment WHERE 1=1";

if (!empty($category)) {
    $sql .= " AND category = :category";
}

if (!empty($availability)) {
    $sql .= " AND status = :availability";
}

$stmt = $pdo->prepare($sql);

if (!empty($category)) {
    $stmt->bindParam(':category', $category);
}

if (!empty($availability)) {
    $stmt->bindParam(':availability', $availability);
}

$stmt->execute();
$equipment = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($equipment);
?>