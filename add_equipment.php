<?php
session_start();
require_once 'config.php';

// Vérifier si l'utilisateur est connecté et est un admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès non autorisé']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reference = $_POST['reference'];
    $name = $_POST['name'];
    $category = $_POST['category'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    
    // Gestion de l'upload d'image
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $uploadDir = 'uploads/';
        $fileName = time() . '-' . basename($_FILES['image']['name']);
        $uploadFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imagePath = $uploadFile;
        }
    }
    
    $stmt = $pdo->prepare("INSERT INTO equipment (reference, name, category, description, price_per_day, image_path) VALUES (?, ?, ?, ?, ?, ?)");
    $result = $stmt->execute([$reference, $name, $category, $description, $price, $imagePath]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Équipement ajouté avec succès']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout de l\'équipement']);
    }
    exit;
}
?>