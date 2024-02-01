const wordLength = ;
const rowCount = 6;
const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
let targetWord;
let wordList;

let currentRowIndex = 0;
let lettersTyped = [];

function tryTypeKey(key) {
    if (currentRowIndex >= rowCount) {
        return;
    }

    key = key.toLowerCase();

    if (key.match(/^[a-z]$/) && lettersTyped.length < wordLength) {
        getCellElement(lettersTyped.length).textContent = key;
        lettersTyped.push(key);
        return;
    }

    if (key == "backspace" && lettersTyped.length != 0) {
        getCellElement(lettersTyped.length - 1).textContent = "";
        lettersTyped.pop();
        return;
    }

    if (key == "enter" && lettersTyped.length == wordLength) {
        if (wordList != null) {
            return alert("Word list not loaded.")
        }

        const typedWord = lettersTyped.join("");
        if (!wordList.includes(typedWord)) {
            return alert("Word not in word list");
        }

        checkMatchingLetters();
        setTimeout(() => checkWinLose(typedWord));

        currentRowIndex++;
        lettersTyped = [];
    }
}

function checkMatchingLetters() {
    const remainingLetters = targetWord.split("");

    lettersTyped.forEach((letter, i) => {
        const letterIndex = remainingLetters.indexOf(letter);
        if (letterIndex != -1) {
            if (targetWord[i] == letter) {
                getCellElement(i).classList.add("green");
                addClassToKey(letter, "green");
            } else {
                getCellElement(i).classList.add("yellow");
                addClassToKey(letter, "yellow");
            }

            remainingLetters.splice(letterIndex, 1);
        } else {
            getCellElement(i).classList.add("grey");
            addClassToKey(letter, "grey");
        }
    });
}

function checkWinLose(typedWord) {
    if (typedWord == targetWord) {
        alert("Congratulations! You were correct.");
        currentRowIndex = rowCount;
    } else if (currentRowIndex == rowCount) {
        alert(`The word was ${targetWord}.`);
    }
}

function addClassToKey(key, className) {
    const keyElement = document.querySelector(`[data-key='${key.toLowerCase()}']`);
    if (keyElement) {
        keyElement.classList.add(className);
    }
}

function getCellElement(index) {
    return board.children[currentRowIndex].children[index];
}

function createBoard() {
    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement("div");
        row.className = "row";
        board.appendChild(row);

        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            row.appendChild(cell);
        }
    }
}

createBoard();

document.addEventListener("keydown", (e) => {
    tryTypeKey(e.key);
});

function createKeyElement(key, keyCode) {
    const keyElement = document.createElement("div");
    keyElement.className = "key";
    keyElement.textContent = key;
    keyElement.dataset.key = key;
    keyElement.onclick = () => tryTypeKey(keyCode);
    return keyElement;
}

function makeKeyboardRow(letters) {
    const row = document.createElement("div");
    row.className = "row";
    keyboard.appendChild(row);

    letters.split("").forEach((key) => {
        row.appendChild(createKeyElement(key, key));
    });
}

makeKeyboardRow("qwertyuiop");
makeKeyboardRow("asdfghjkl");
makeKeyboardRow("zxcvbnm");
keyboard.lastChild.prepend(createKeyElement("↵", "enter"));
keyboard.lastChild.appendChild(createKeyElement("⌫", "backspace"));

async function fetchWordList() {
    const response = await fetch("wordlist.txt");
    const data = await response.text();
    wordList = data.split("\n").filter((word) => word.length == wordLength);
    targetWord = wordList[Math.floor(Math.random() * wordList.length)];
}

fetchWordList();
