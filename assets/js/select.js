// Select the element with the class 
let moles = document.querySelectorAll(".bokits");
let scoreContainer = document.querySelector(".score");
let timerContainer = document.querySelector(".timer");
let counter = timerContainer.textContent;
let noBokit = document.querySelector(".no_bokit");

// Convert the NodeList to an array
let molesArr = Array.prototype.slice.call(moles);

// Declare variables
let random;
let hitPosition;
let score = 0;
let count = 0;
let difficulty = "Facile";

// Function to play the game
function renderGame() {
  // Remove the "bokits-active" class from all elements in the molesArr array
  molesArr.forEach((curr) => {
    curr.classList.remove("bokits-active");
  });

  // Generate a random number within the range of the molesArr length
  random = Math.floor(Math.random() * molesArr.length);

  // Add the "bokits-active" class to the randomly selected element
  molesArr[random].classList.add("bokits-active");

  // Get the id of the randomly selected element
  hitPosition = molesArr[random].id;

  // Increment the count and update the text content of noBokit
  count++;
  noBokit.textContent = count;

  // Adjust the speed based on the difficulty level
  let speed = 950; // Default speed
  if (difficulty === "Normal") {
    speed = 750; 
  } else if (difficulty === "Difficile") {
    speed = 550; 
  } else if (difficulty === "ULTRA") {
    speed = 350; 
  }

  // Clear the interval and start a new one with the updated speed
  clearInterval(interval);
  interval = setInterval(update, speed);
}

// Function to render the score
function renderScore() {
  // Add a click event listener to each element in the molesArr array
  molesArr.forEach((curr) => {
    curr.addEventListener("click", function () {
      // Check if the clicked element's id matches the hitPosition
      if (hitPosition == curr.id) {
        // Increment the score and update the scoreContainer text content
        score++;
        scoreContainer.textContent = score;
      }
    });
  });
}

// Call the renderScore function
renderScore();

// Declare the interval variable
let interval;

// Function to render the timer
function renderTimer() {
  // Decrease the counter by 1 and update the timerContainer text content
  if (counter > 0) {
    counter--;
    timerContainer.textContent = counter;
  } else {
    // Clear the interval, remove the "bokits-active" class from the randomly selected element, and call the showEndScreen function
    clearInterval(interval);
    molesArr[random].classList.remove("bokits-active");
    showEndScreen();
  }
}

// Function to update the game state
function update() {
  // Call the renderGame and renderTimer functions
  renderGame();
  renderTimer();
}

// Add a change event listener to the element with the id "difficulty"
document.getElementById("difficulty").addEventListener("change", function () {
  // Update the difficulty variable with the selected value
  difficulty = this.value;
});

// Add a click event listener to the element with the class "play"
document.querySelector(".play").addEventListener("click", function () {
  // Check if the interval variable is not set (game not already in progress)
  if (!interval) {
    // Hide menu items and show control button container
    document.getElementById("menuItems").style.display = "none";
    document.getElementById("control-btn1").style.display = "block";

    // Start the interval with the default speed and call the renderGame function
    interval = setInterval(update, 950);
    renderGame();
  }
});

// Add a click event listener to the element with the class "reset"
document.querySelector(".reset").addEventListener("click", function () {
  // Reload the page to reset the game
  location.reload();
});

// Function to show the end screen
function showEndScreen() {
  // Update the scoreValue element's innerHTML with the score and display the end screen
  document.getElementById("scoreValue").innerHTML = scoreContainer.textContent + " : Bokit attrapés ";
  document.getElementById("endScreen").style.display = "block";

  // Update the saveBtn element's text and enable it
  document.getElementById("saveBtn").innerHTML = "Sauvegarder!";
  document.getElementById("saveBtn").disabled = false;
}

// Function to show the menu
function showMenu() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("menuItems").style.display = "block";
}

// Function to show the scores screen
function showScores() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("scoresScreen").style.display = "block";

  // Call the getScores function to fetch and populate the scores
  getScores();
}

// Function to close the scores screen and show the end screen
function closeScores() {
  document.getElementById("endScreen").style.display = "block";
  document.getElementById("scoresScreen").style.display = "none";
}

// Function to save the score
function saveScore() {
  // Get the bokits score, name, and difficulty
  const bokits = scoreContainer.textContent;
  const name = document.getElementById("name").value;
  if (name == "") {
    // Display an alert if the name is empty
    alert("Enter your name!");
    return;
  }
  const difficulty = document.getElementById("difficulty").value;

  // Create a data object with the score information
  const data = {
    Name: name,
    Bokits: bokits,
    Difficulty: difficulty
  };

  // Send a POST request to the server to save the score
  fetch('server.php', {
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

      // Update the saveBtn text and disable it
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

// Function to populate the scores table
function populateScores(scores) {
  const table = document.querySelector("#scoresContainer table");

  // Clear existing table rows except for the header row
  const rows = table.querySelectorAll("tr:not(:first-child)");
  rows.forEach((row) => row.remove());

  let index = 1;
  for (const difficulty in scores) {
    const scoresByDifficulty = scores[difficulty];
    scoresByDifficulty.forEach((score) => {
      const newRow = document.createElement("tr");

      const indexCell = document.createElement("td");
      indexCell.textContent = index;
      newRow.appendChild(indexCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = score.Name;
      newRow.appendChild(nameCell);

      const bokitsCell = document.createElement("td");
      bokitsCell.textContent = score.Bokits;
      newRow.appendChild(bokitsCell);

      const difficultyCell = document.createElement("td");
      difficultyCell.textContent = difficulty;
      newRow.appendChild(difficultyCell);

      table.appendChild(newRow);
      index++;
    });
  }
}

// Function to extract table data
function getTableData() {
  // Select the table element
  const table = document.querySelector('#scoresScreen table');

  // Get all the rows from the table (excluding the header row)
  const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));

  // Define an array to store the extracted data
  const data = [];

  // Loop through each row
  rows.forEach(row => {
    // Select all the cells in the row
    const cells = Array.from(row.querySelectorAll('td'));

    // Extract the text content from each cell and push it to the data array
    const rowData = cells.map(cell => cell.textContent.trim());
    data.push(rowData);
  });

  return data;
}

// Function to handle the "Retour" button click
function handleRetourClick() {
  // Retrieve the table data
  const tableData = getTableData();

  // Log the extracted data
  console.log(tableData);

  closeScores();
}

// Function to fetch and display the scores
function getScores() {
  fetch('server.php')
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

// Function to format the scores data
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
