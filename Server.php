<?php
// Classe pour gérer la connexion à la base de données
class Database {
    private $host;
    private $username;
    private $password;
    private $dbname;
    private $pdo;

    public function __construct($host, $username, $password, $dbname) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
    }

    // Méthode pour se connecter à la base de données
    public function connect() {
        try {
            $dsn = "mysql:host=$this->host;dbname=$this->dbname";
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Échec de la connexion à la base de données: " . $e->getMessage());
        }
    }

    // Méthode pour obtenir l'objet PDO de la connexion
    public function getPDO() {
        return $this->pdo;
    }
}

// Classe pour gérer les scores
class Score {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Méthode pour obtenir les scores avec une difficulté spécifique
    public function getScoresWithDifficulty($difficulty) {
        $conn = $this->db->getPDO();
        $query = "SELECT Name Bokits FROM Scores WHERE Difficulty LIKE :difficulty";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':difficulty', $difficulty);
        $stmt->execute();
        $scores = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $scores;
    }

    // Méthode pour obtenir tous les scores pour différentes difficultés
    public function getAllScores() {
        $easy = $this->getScoresWithDifficulty('Facile');
        $medium = $this->getScoresWithDifficulty('Normal');
        $hard = $this->getScoresWithDifficulty('Difficile');
        $insane = $this->getScoresWithDifficulty('ULTRA');
        return ["Facile" => $easy, "Normal" => $medium, "Difficile" => $hard, "ULTRA" => $insane];
    }

    // Méthode pour ajouter  les scores   
    public function addScores($data) {
        $conn = $this->db->getPDO();
        $query = $conn->prepare("INSERT INTO Scores (`Name`,`Bokits`,`Difficulty`) VALUES (:Name, :Bokits, :Difficulty)");
       
                // EXECUTION
         // htmlspecialchars = protection
         $query->bindValue('Name',htmlspecialchars($data['Name']));
         $query->bindValue('Bokits',htmlspecialchars($data['Bokits']));
         $query->bindValue('Difficulty',htmlspecialchars($data['Difficulty']));

         $query->execute();

        }
}
// Configuration de la base de données
$db_host = "localhost";
$db_user = "root";
$db_password = "";
$db_name = "bokit";

// Création de l'objet de connexion à la base de données
$db = new Database($db_host, $db_user, $db_password, $db_name);
$db->connect();

$score = new Score($db);

// Assuming $score is an instance of the Score class

if (isset($_POST["data"])) {
    $data = json_decode($_POST['data'], true);
    $score->addScores($data);
    echo "score inserted";
} else {
    $result = $score->getAllScores();
    $formattedResult = [];

    foreach ($result as $difficulty => $scores) {
        $formattedScores = [];
        foreach ($scores as $score) {
            $formattedScores[] = [
                "Name" => $score->Name,
                "Bokits" => $score->Bokits,
                "Difficulty" => $difficulty
            ];
        }
        $formattedResult[$difficulty] = $formattedScores;
    }

    echo json_encode($formattedResult);
}

?>

