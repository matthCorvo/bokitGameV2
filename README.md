# Jeu Attrape Bokits

Le jeu Bokits est un jeu web simple où les joueurs doivent cliquer sur des bokits en mouvement pour marquer des points. Le jeu utilise JavaScript pour le frontend et PHP avec MySQL pour le backend afin de stocker et récupérer les scores.

## Fonctionnalités

- Cliquez sur les bokits en mouvement pour marquer des points.
- Plusieurs niveaux de difficulté : Facile, Normal, Difficile, ULTRA.
- Minuterie pour suivre la durée du jeu.
- Les scores sont stockés dans une base de données MySQL et peuvent être consultés sur le tableau des scores.
- Les joueurs peuvent entrer leur nom et enregistrer leurs scores.

## Technologies utilisées

- JavaScript : Utilisé pour la logique du jeu et l'interactivité côté frontend.
- PHP : Gère les opérations côté serveur du backend et se connecte à la base de données MySQL.
- MySQL : Stocke les scores et les données des joueurs.
- HTML/CSS : Fournit la structure et la mise en forme de l'interface du jeu.

## Instructions d'installation

1. Clonez le dépôt sur votre machine locale.
2. Importez le schéma de base de données MySQL fourni (bokit.sql) dans votre serveur MySQL.
3. Mettez à jour la configuration de la base de données dans db/config.php avec les détails de votre serveur MySQL (hôte, nom de la base de données, nom d'utilisateur, mot de passe).
4. Assurez-vous d'avoir un environnement de serveur web configuré (par exemple, Apache, Nginx) et qu'il est configuré pour exécuter les fichiers PHP.
5. Lancez le jeu en ouvrant index.html dans un navigateur web.

## Instructions du jeu

1. Sélectionnez le niveau de difficulté dans le menu déroulant.
2. Cliquez sur le bouton "Jouer" pour commencer le jeu.
3. Cliquez sur les bokits en mouvement pour marquer des points.
4. Le jeu se termine lorsque la minuterie atteint zéro.
5. Après la fin du jeu, le score sera affiché et vous pourrez saisir votre nom pour enregistrer le score.
6. Cliquez sur le bouton "Sauvegarder !" pour enregistrer le score dans la base de données.
7. Vous pouvez consulter le tableau des scores en cliquant sur le bouton "Scores".
8. Sur le tableau des scores, vous pouvez voir les meilleurs scores pour chaque niveau de difficulté.

## Server.php

Le fichier Server.php est responsable de la gestion des requêtes du jeu côté serveur, notamment l'enregistrement des scores et la récupération des scores depuis la base de données MySQL.

```
// Méthode pour obtenir les scores avec une difficulté spécifique
public function getScoresWithDifficulty($difficulty) {
    $conn = $this->db->getConnection();
    $query = "SELECT Name, Bokits FROM scores WHERE Difficulty LIKE ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $difficulty);
    $stmt->execute();
    $result = $stmt->get_result();

    $scores = [];
    while ($row = $result->fetch_assoc()) {
        $scores[] = [
            "Name" => $row["Name"],
            "Bokits" => $row["Bokits"]
        ];
    }
    return $scores;
}


// Méthode pour obtenir tous les scores pour différentes difficultés
public function getAllScores() {
    $difficulties = ["Facile", "Normal", "Difficile", "ULTRA"];
    $result = [];
    foreach ($difficulties as $difficulty) {
        $scores = $this->getScoresWithDifficulty($difficulty);
        $formattedScores = [];
        foreach ($scores as $score) {
            $formattedScores[] = $score;
        }
        $result[$difficulty] = $formattedScores;
    }
    return $result;
}


// Méthode pour ajouter les scores   
public function addScores($data) {
    $conn = $this->db->getConnection();
    $query = $conn->prepare("INSERT INTO scores (`Name`, `Bokits`, `Difficulty`) VALUES (?, ?, ?)");

    // Lier les paramètres avec leurs valeurs respectives
    $query->bind_param( "sss", $data['Name'], $data['Bokits'], $data['Difficulty']);
    
    $query->execute();

    // Vérifier si l'insertion a réussi
    if ($query->affected_rows > 0) {
        return true; // Les données ont été ajoutées avec succès
    } else {
        return false; // Échec de l'ajout des données
    }
}

public function fetchScores() {
    $conn = $this->db->getConnection();
    $query = "SELECT * FROM scores ORDER BY Difficulty, Bokits DESC";
    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $scores = [];

        while ($row = $result->fetch_assoc()) {
            $difficulty = $row['Difficulty'];
            $name = $row['Name'];
            $bokits = $row['Bokits'];

            $scores[] = [
                "Difficulty" => $difficulty,
                "Name" => $name,
                "Bokits" => $bokits
            ];
        }

        return $scores;
    } else {
        return [];
    }
}


}
$scoreObj = new Score($db_host, $db_user, $db_password, $db_name);

// Gérer la soumission du score
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($scoreObj->addScores($data)) {
        $scoresData = $scoreObj->fetchScores();
        echo json_encode($scoresData);
    } else {
        echo "Échec de l'ajout des scores.";
    }
} else {
    // Récupérer les scores
    $scoresData = $scoreObj->fetchScores();
    echo json_encode($scoresData);
}

```
## Connexion avec JavaScript
La communication entre JavaScript et le serveur se fait principalement à l'aide de requêtes HTTP (AJAX). Voici un extrait de code qui montre comment envoyer une requête POST pour enregistrer les scores à partir de JavaScript :

```
// Fonction pour enregistrer le score
function saveScore() {
    // Obtenir le score, le nom et la difficulté du joueur
    const bokits = scoreContainer.textContent;
    const name = document.getElementById("name").value;
    const difficulty = document.getElementById("difficulty").value;

    // Créer un objet de données avec les informations du score
    const data = {
        Name: name,
        Bokits: bokits,
        Difficulty: difficulty
    };

    // Envoyer une requête POST au serveur pour enregistrer le score
    fetch('Server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add scores.');
            }
        })
        .then(function (data) {
            // Traitement des données de réponse du serveur
            console.log(data); // Afficher la réponse du serveur (facultatif)
            // Mettre à jour les scores après l'enregistrement
            getScores();
        })
        .catch(function (error) {
            console.error(error);
            alert("Failed to add scores.");
        });
}

```
