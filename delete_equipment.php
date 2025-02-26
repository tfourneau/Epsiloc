<?php
session_start();
require_once 'config.php';

// Vérifier si l'utilisateur est connecté et est un admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès non autorisé']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = $_POST['id'];
    
    // Vérifier si l'équipement n'est pas actuellement loué
    $stmt = $pdo->prepare("SELECT * FROM rentals WHERE equipment_id = ? AND status IN ('pending', 'active')");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cet équipement est actuellement loué ou réservé']);
        exit;
    }
    
    $stmt = $pdo->prepare("DELETE FROM equipment WHERE id = ?");
    $result = $stmt->execute([$id]);
    
    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Requête invalide']);
?>