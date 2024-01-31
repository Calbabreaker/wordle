const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const targetWord = wordList[Math.floor(Math.random() * wordList.length)];

const rows = [];
let currentRowIndex = 0;
let lettersTyped = [];

for (let i = 0; i < 6; i++) {
    const row = [];
    rows.push(row);

    for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        row.push(cell);
        board.appendChild(cell);
    }
}

document.addEventListener("keydown", (e) => {
    tryTypeKey(e.key);
});

window.addEventListener("keyup", (e) => {
    modifyKeyClass(e.key, (list) => list.remove("pressed"));
});

function tryTypeKey(key) {
    key = key.toLowerCase();

    if (key.match(/^[a-z]$/) && lettersTyped.length < 5) {
        getCellElement(lettersTyped.length).textContent = key;
        lettersTyped.push(key);
        modifyKeyClass(key, (list) => list.add("pressed"));
    } else if (key == "backspace" && lettersTyped.length != 0) {
        getCellElement(lettersTyped.length - 1).textContent = "";
        lettersTyped.pop();
    } else if (key == "enter" && lettersTyped.length == 5) {
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
            if (letterIndex == i) {
                getCellElement(i).classList.add("green");
                modifyKeyClass(letter, (list) => list.add("green"));
            } else {
                getCellElement(i).classList.add("yellow");
                modifyKeyClass(letter, (list) => list.add("yellow"));
            }

            remainingLetters[letterIndex] = undefined;
        } else {
            getCellElement(i).classList.add("grey");
            modifyKeyClass(letter, (list) => list.add("grey"));
        }
    });
}

function checkWinLose(typedWord) {
    if (typedWord == targetWord) {
        alert("Congratulations! You were correct.");
        location.reload();
    } else if (currentRowIndex == 6) {
        alert(`The word was ${targetWord}.`);
        location.reload();
    }
}

function modifyKeyClass(key, func) {
    const keyElement = document.querySelector(`[data-key='${key.toLowerCase()}']`);
    if (keyElement) {
        func(keyElement.classList);
    }
}

function getCellElement(index) {
    return rows[currentRowIndex][index];
}

function makeKeyboardRow(letters) {
    const row = document.createElement("div");
    row.className = "row";

    letters.split("").forEach((key) => {
        const keyElement = document.createElement("div");
        keyElement.className = "key";
        keyElement.textContent = key;
        keyElement.dataset.key = key;
        row.appendChild(keyElement);
    });

    keyboard.appendChild(row);
}

makeKeyboardRow("qwertyuiop");
makeKeyboardRow("asdfghjkl");
makeKeyboardRow("zxcvbnm");
