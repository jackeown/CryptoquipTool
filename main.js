window.puzzle = "";
window.sub = {};
window.letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
for(let letter of letters){
    sub[letter] = "&nbsp";
}


let puzzleEntry = document.querySelector("#PuzzleEntry")
let puzzleInput = document.querySelector("#puzzleInput");
let puzzleButton = document.querySelector("#PuzzleEntry > button");

let puzzleSolver = document.querySelector("#PuzzleSolver");
let puzzleTextDiv = document.querySelector("#puzzleTextDiv");
let subDiv = document.querySelector("#subDiv")
let subInput = document.querySelector("#subInput")

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