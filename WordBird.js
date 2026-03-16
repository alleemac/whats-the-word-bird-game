var height = 6; // Number of Guesses Allowed
var width = 5; // Length of The Word

 var row = 0; // Current Guess/Attempt Number
 var column = 0; // Letter Guess For Attempt

 var winSound = new Audio("https://www.myinstants.com/media/sounds/winner_ms0vcwJ.mp3") // Winner Sound
var enterSound = new Audio ("https://www.myinstants.com//media/sounds/chirp-fancade.mp3")

 var gameOver = false;
 var wordList = ["booby", "brant", "crake", "crane", "diver", "eagle", "egret", "eider", "finch", "galah", "goose", "grebe", "heron", "hobby", "homer", "junco", "macaw", "merle", "miner", "munia", "mynah", "noddy", "ousel", "ouzel", "pewit", "pipit", "pitta", "prion", "quail", "raven", "robin", "saker", "scaup", "serin", "snipe", "stilt", "stork", "swift", "twite", "veery", "vireo"];

// Placeholder guessList until JSON loads
var guessList = [];

// Fetch guess words from JSON
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    guessList = data.words.map(word => word.toLowerCase());
    console.log("Guess list loaded:", guessList);
  })
  .catch(err => console.error("Error loading guess list:", err));

// Random word selection (unchanged)
var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
console.log(word);

window.onload = function () {
    initialize();
}



function initialize() {
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r + "-" + c;
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }


// Create Keyboard
let keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
]

for (let i = 0; i < keyboard.length; i++) {
    let currRow = keyboard[i];
    let keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");

    for (let j = 0; j < currRow.length; j++) {
        let keyTile = document.createElement("div");
        let key = currRow[j];
        keyTile.innerText = key;
        if (key == "Enter") {
            keyTile.id = "Enter";
        }
        else if (key == "⌫") {
            keyTile.id = "Backspace";
        }
        else if("A" <= key && key <= "Z") {
            keyTile.id = "Key" + key; // Makes it revert back to KeyA, KeyB, etc.
        }
        keyTile.addEventListener("click", processKey);

        if (key == "Enter") {
            keyTile.classList.add("enter-key-tile");
        } else {
            keyTile.classList.add("key-tile");
        }
        keyboardRow.appendChild(keyTile);
    }
    document.body.appendChild(keyboardRow);

}



// User Key Presses
document.addEventListener("keyup", (e) => {
    processInput(e);
})}



function processKey() {
let e = {"code" : this.id};
processInput(e);
}




function processInput(e) {
    if (gameOver) return;

    //Make Sure User Presses Allowed Keys
if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (column < width) {
        let currTile = document.getElementById(row.toString() + '-' + column.toString());
        if (currTile.innerText == "") {
            currTile.innerText = e.code[3];
            column += 1;
        }
    }
}
else if (e.code =="Backspace") {
    if (0 < column && column <= width) {
        column -= 1;
    }
            let currTile = document.getElementById(row.toString() + '-' + column.toString());
            currTile.innerText ="";

}
else if (e.code == "Enter") {
enterSound.play();
    update ();
}

if (!gameOver && row == height) {
    gameOver = true;
    document.getElementById("answer").innerText = word;
    const refreshButton = document.createElement("button");
    refreshButton.innerText = "Try Again";

    // Add a CSS class
    refreshButton.classList.add("refresh-btn");

    // Reload the page when clicked
    refreshButton.onclick = function() {
        window.location.reload();
    };

    // Append the button under the answer
    document.getElementById("answer").appendChild(refreshButton);
}
}



function update () {
let guess = "";
document.getElementById("answer").innerText="";

//Guess Word String
for (let c = 0; c < width; c++ ) {
    let currTile = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currTile.innerText;
    guess += letter;
}

//Tells Users Its Not In Word List
guess = guess.toLowerCase();
if (!guessList.includes(guess)) {
     document.getElementById("answer").innerText = "Not in word list";
     return;
}



    //Start Processing Users Game
    let correct = 0;
    // Checks Letter Count & If In Right Postion //
    let letterCount = {};
for (let i =0; i < word.length; i++) {
    letter = word[i];
    if (letterCount[letter]) {
        letterCount[letter] +=1;
    }
    else {
        letterCount[letter] = 1;
    }
}

//Check All Correct Letters //
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
                }

    

    if (correct == width) {
        gameOver = true;
        winSound.play();
             document.getElementById("answer").innerText = "Winner, Winner. Chicken Dinner.";

    }

    
}




// Re-Check and Mark What Is Present Or Wrong Position //
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        if (!currTile.classList.contains("correct")) {

      //Checks Its In The Word At All
        if (word.includes(letter) && letterCount[letter] > 0) {
            currTile.classList.add("present");
            letterCount[letter] -= 1;
        }
        //If Its Not In The Word
        else {
            currTile.classList.add("absent");
        }
    }


}
//Starts New Row After Guess
row += 1; //Starts New Row
column = 0; // Starts New Column
}


