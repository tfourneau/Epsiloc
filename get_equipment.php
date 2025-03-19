<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'config.php';

// Vérification de la connexion à la base de données
if (!$pdo) {
    die(json_encode(["error" => "Connexion à la base de données échouée."]));
}

$category = isset($_GET['category']) ? $_GET['category'] : '';
$availability = isset($_GET['availability']) ? $_GET['availability'] : '';

$sql = "SELECT * FROM equipment WHERE 1=1";

if (!empty($category)) {
    $sql .= " AND category = :category";
}

if (!empty($availability)) {
    $sql .= " AND status = :availability";
}

try {
    $stmt = $pdo->prepare($sql);

    if (!empty($category)) {
        $stmt->bindParam(':category', $category);
    }
    if (!empty($availability)) {
        $stmt->bindParam(':availability', $availability);
    }

    $stmt->execute();
    $equipment = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Vérification de la réponse
    if ($equipment === false) {
        echo json_encode(["error" => "Erreur lors de la récupération des équipements."]);
    } else {
        echo json_encode($equipment);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
