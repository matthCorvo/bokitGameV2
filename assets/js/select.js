let moles = document.querySelectorAll(".bokits");
let Scorecontainer = document.querySelector(".score");
let timercontainer = document.querySelector(".timer");
let counter = timercontainer.textContent;
let no_bokit = document.querySelector(".no_bokit");

let molesArr = Array.prototype.slice.call(moles);
let random;

let hitPosition;

let score = 0;
let count = 0;
let difficulty = "Easy";

function renderGame() {
  molesArr.forEach((curr) => {
    curr.classList.remove("bokits-active");
  });
  random = Math.floor(Math.random() * molesArr.length);
  molesArr[random].classList.add("bokits-active");
  hitPosition = molesArr[random].id;
  count++;
  no_bokit.textContent = count;

  // Adjust the speed based on the difficulty level
  let speed = 950; // Default speed
  if (difficulty === "Normal") {
    speed = 750; // Increase the speed for Normal difficulty
  } else if (difficulty === "Difficile") {
    speed = 550; // Increase the speed for Difficulty difficulty
  } else if (difficulty === "ULTRA") {
    speed = 350; // Increase the speed for Insane difficulty
  }

  clearInterval(interval);
  interval = setInterval(update, speed);
}

function renderScore() {
  molesArr.forEach((curr) => {
    curr.addEventListener("click", function () {
      if (hitPosition == curr.id) {
        score++;
        Scorecontainer.textContent = score;
      }
    });
  });
}

renderScore();

let interval;

function renderTimer() {
  if (counter > 0) {
    counter--;
    timercontainer.textContent = counter;
  } else {
    clearInterval(interval);
    molesArr[random].classList.remove("bokits-active");
    showEndScreen(); // Call the showEndScreen function when the game is over
  }
}

function update() {
  renderGame();
  renderTimer();
}

document.getElementById("difficulty").addEventListener("change", function () {
  difficulty = this.value;
});

document.querySelector(".play").addEventListener("click", function () {
  if (!interval) {
    // Hide menu items and show control button container
    document.getElementById("menuItems").style.display = "none";
    document.getElementById("control-btn1").style.display = "block";
    interval = setInterval(update, 950);
    renderGame();
  }
});

document.querySelector(".reset").addEventListener("click", function () {
  location.reload();
});

function showEndScreen() {
  document.getElementById("scoreValue").innerHTML = "Score: " + Scorecontainer.textContent;
  document.getElementById("endScreen").style.display = "block";
  document.getElementById("saveBtn").innerHTML = "Sauvegarder!";
document.getElementById("saveBtn").disabled = false;
}

function showMenu() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("menuItems").style.display = "block";
}
 
function showScores() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("scoresScreen").style.display = "block";
  getScores();
}

function closeScores() {
  document.getElementById("endScreen").style.display = "block";
  document.getElementById("scoresScreen").style.display = "none";
}
  let scorecontainer = document.querySelector(".score");

   


  function saveScore() {
    const bokits = Scorecontainer.textContent;
    const name = document.getElementById("name").value;
    if (name == "") {
      alert("Enter your name!");
      return;
    }
    const difficulty = document.getElementById("difficulty").value;
  
    const data = {
      Name: name,
      Bokits: bokits,
      Difficulty: difficulty
    };
  
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
        console.log(data); // Optional: Log the response from the server
        document.getElementById("saveBtn").innerHTML = "OK!";
        document.getElementById("saveBtn").disabled = true;
  
        // Update the scores after saving
        getScores();
      })
      .catch(function (error) {
        console.error(error);
        alert("Failed to add scores.");
      });
  }
  
function populateScores(scores) {
    const scoresContainer = document.getElementById("scoresContainer");
    scoresContainer.innerHTML = "";
  
    for (const difficulty in scores) {
      const scoresByDifficulty = scores[difficulty];
  
      const difficultyHeading = document.createElement("h3");
      difficultyHeading.textContent = difficulty;
      scoresContainer.appendChild(difficultyHeading);
  
      if (Array.isArray(scoresByDifficulty)) {
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        const nameHeader = document.createElement("th");
        nameHeader.textContent = "Name";
        const bokitsHeader = document.createElement("th");
        bokitsHeader.textContent = "Bokits";
  
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(bokitsHeader);
        table.appendChild(headerRow);
  
        scoresByDifficulty.forEach((score, index) => {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          nameCell.textContent = score.Name;
          const bokitsCell = document.createElement("td");
          bokitsCell.textContent = score.Bokits;
  
          row.appendChild(nameCell);
          row.appendChild(bokitsCell);
          table.appendChild(row);
        });
  
        scoresContainer.appendChild(table);
      }
    }
  }
  
  
  function getScores() {
    fetch('Server.php')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const formattedScores = formatScores(data);
        populateScores(formattedScores);
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  }
  
  
  function formatScores(data) {
    let formattedScores = {};
  
    data.forEach((score) => {
      const difficulty = score.Difficulty;
      if (!formattedScores.hasOwnProperty(difficulty)) {
        formattedScores[difficulty] = [];
      }
      formattedScores[difficulty].push({
        Name: score.Name,
        Bokits: score.Bokits,
      });
    });

  return formattedScores;
  
}
function formatScoreTable(data, header) {
    let scores = data.filter((score) => score.Difficulty === header);
  
    let html = "";
  
    html += "<table>";
    html += "<tr><th>Name</th><th>Bokits</th></tr>";
  
    if (scores.length > 0) {
      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
  
        html += "<tr>";
        html += "<td>" + (i + 1) + ".</td>";
        html += "<td title='" + score.Name + "'>" + score.Name + "</td>";
        html += "<td>" + score.Bokits + "</td>";
        html += "</tr>";
      }
    }
  
    html += "</table>";
  
    return html;
  }