window.puzzle = "";
window.sub = {};
window.letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
for(let letter of letters){
    sub[letter] = "&nbsp";
}


let puzzleEntry = document.querySelector("#PuzzleEntry")
let puzzleInput = document.querySelector("#puzzleInput");
let puzzleButton = document.querySelector("#submitPuzzle");

let puzzleSolver = document.querySelector("#PuzzleSolver");
let puzzleTextDiv = document.querySelector("#puzzleTextDiv");
let subDiv = document.querySelector("#subDiv")
let subInput = document.querySelector("#subInput")
let randomPuzzle = document.querySelector("#randomPuzzle")

let puzzleCongrats = document.querySelector("#PuzzleCongrats");


puzzleInput.focus();
puzzleButton.addEventListener("click", function(e){
    window.puzzle = puzzleInput.value;
    puzzleEntry.classList.add("hidden");
    puzzleSolver.classList.remove("hidden");

    updatePuzzle();
    updateSub();
    subInput.focus();
});


/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
 function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function joke2Puzzle(joke){
    joke = joke.toUpperCase();
    let shuffled = Array.from(window.letters);
    shuffle(shuffled);

    let map = {};
    for (let i=0; i<window.letters.length; i++){
        map[window.letters[i]] = shuffled[i];
    }

    return Array.from(joke).map(x=>(Object.keys(map).includes(x))?map[x]:x).join('');
}



function applySub(sub, puzzle){
    let s = "";
    puzzle = puzzle.toUpperCase();

    for(let letter of puzzle){
        let original = true;
        if(letter in sub && sub[letter] != "&nbsp"){
            original = false;
            letter = sub[letter];
        }
        if(letter == "\n")
            letter = "<br>";

        s += `<span class=${original ? "blue" : "green"}>${letter}</span>`
    }

    return s;
}

function formatSub(sub){
    let s = "";
    let keys = Object.keys(sub).sort();
    let values = keys.map(k => sub[k]);
    for(let key of keys)
        s += key;
    s += "<br><span class='blue'>";

    for(let value of values)
        s += value;

    s += '</span>'
    return s;
}

function updatePuzzle(){
    puzzleTextDiv.innerHTML = applySub(sub, puzzle);
}

function updateSub(){
    subDiv.innerHTML = formatSub(sub);
}


function isAlpha(l){
    for(let letter of letters){
        if(l === letter)
            return true;
    }
    return false;
}

function detectSolved(){
    let unmapped = Array.from(window.puzzle.toUpperCase()).filter(l => isAlpha(l) && !(l in sub && sub[l] != "&nbsp"));
    if(unmapped.length == 0){
        puzzleSolver.classList.add("hidden");
        puzzleCongrats.classList.remove("hidden");
        document.querySelector("#solved").innerHTML = applySub(sub, puzzle);
    }
}



function getRandomPuzzle(){
    let index = Math.floor(Math.random() * window.jokes.length)
    let joke = window.jokes[index];
    console.log(joke);
    let puzzle = joke2Puzzle(joke);
    console.log(puzzle);
    puzzleInput.innerHTML = puzzle;
    // puzzleInput.value = joke2Puzzle(joke);
}



window.jokes = ["Sorry. Puzzles currently can't be loaded :("]

fetch('/jokes.json').then(x=>x.json()).then(function(jokes) {
    window.jokes = jokes;
})







subInput.addEventListener("keyup", function(e){
    if(e.key == "Enter" || e.key == "Return"){
        let val = subInput.value;
        subInput.value = "";

        let [left,right] = val.split("=");
        left = left.toUpperCase();
        right = right.toUpperCase();
        if(left.length == 1 && right.length == 1){
            if(right == "_")
                right = "&nbsp";
            sub[left] = right;
            updatePuzzle();
            updateSub();
            detectSolved();
        }
    }
});