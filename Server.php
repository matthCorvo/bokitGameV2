<?php
class Database {
    private $db_host = "localhost";
    private $db_user = "root";
    private $db_password = "";
    private $db_name = "bokit";
    private $conn;

    public function __construct() {
        $this->conn = new mysqli($this->db_host, $this->db_user, $this->db_password, $this->db_name);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    public function closeConnection() {
        $this->conn->close();
    }
}

// Classe pour gérer les scores
class Score {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function getDb() {
        return $this->db;
    }


    // Méthode pour obtenir les scores avec une difficulté spécifique
    public function getScoresWithDifficulty($difficulty) {
        $conn = $this->db->getConnection();
        $query = "SELECT Name, Bokits FROM Scores WHERE Difficulty LIKE ?";
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
        $difficulties = ["facile", "normal", "difficile", "ULTRA"];
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
        $query = $conn->prepare("INSERT INTO Scores (`Name`, `Bokits`, `Difficulty`) VALUES (?, ?, ?)");

        // Bind the parameters with their respective values
        $query->bind_param( "sss", $data['Name'], $data['Bokits'], $data['Difficulty']);
        
        $query->execute();

        // Check if the insertion was successful
        if ($query->affected_rows > 0) {
            return true; // Data was successfully added
        } else {
            return false; // Failed to add data
        }
    }
    public function fetchScores() {
        $conn = $this->db->getConnection();
        $query = "SELECT * FROM Scores ORDER BY Difficulty, Bokits DESC";
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
$scoreObj = new Score();

// Handle the score submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($scoreObj->addScores($data)) {
        $scoresData = $scoreObj->fetchScores();
        echo json_encode($scoresData);
    } else {
        echo "Failed to add scores.";
    }
} else {
    // Fetch scores
    $scoresData = $scoreObj->fetchScores();
    echo json_encode($scoresData);
}



?>
