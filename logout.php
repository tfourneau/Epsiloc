<?php
session_start();
session_destroy();
header('Location: login.html'); // Redirection vers la page de connexion
exit;
?>
