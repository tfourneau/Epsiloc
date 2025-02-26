<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = $_POST['fullName'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $passwordConfirm = $_POST['passwordConfirm'];
    
    // Vérification que les mots de passe correspondent
    if ($password !== $passwordConfirm) {
        echo json_encode(['success' => false, 'message' => 'Les mots de passe ne correspondent pas']);
        exit;
    }
    
    // Vérification si l'email existe déjà
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé']);
        exit;
    }
    
    // Hashage du mot de passe
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $result = $stmt->execute([$fullName, $email, $hashedPassword]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Inscription réussie, vous pouvez maintenant vous connecter']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'inscription']);
    }
    exit;
}
?>