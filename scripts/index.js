"use strict";

const EnglishKeyboard = [
    [['~', '`'], ['!', '1'], ['@', '2'], ['#', '3'], ['$', '4'], ['%', '5'], ['^', '6'], ['&', '7'], ['*', '8'], ['[', '9'], [']', '0'], ['-', '_'], ['+', '='], "Backspace"],
    ["Tab", 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', ['{', '['], ['}', ']'], ['|', '\\']],
    ["Caps Lock", 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', [':', ','], ['\'', '\''], "Enter"],
    ["Shift", 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ['<', ','], ['>', '.'], ['?', '/'], "Shift"]
];
// array function
function zip(arr1, arr2) {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
}
function plus(lhs, rhs) { return lhs + rhs; }
function scan(arr, folder, state) {
    const result = [];
    for (const it of arr) {
        result.push(state);
        state = folder(state, it)
    }
    return result;
}
function range(start, end) {
    const result = [];
    for (let i = start; i < end + 1; i++) {
        result.push(i);
    }
    return result;
}
function length(arr) { return arr.length; }
function replicate(count, initial) {
    const result = [];
    for (let i = 0; i != count; ++i) {
        result.push(initial);
    }
    return result;
}
function zip4(arr1, arr2, arr3, arr4) {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        result.push([arr1[i], arr2[i], arr3[i], arr4[i]]);
    }
    return result;
}

function zip4_2D(arr1, arr2, arr3, arr4) {
    return zip4(arr1, arr2, arr3, arr4).map((it) => { return zip4(it[0], it[1], it[2], it[3]) });
}
// array function end

const itemsSpan = [3, 3, 4, 5];

const gridColumnSpans = zip(EnglishKeyboard, itemsSpan).map(
    (pairs) => {
        const items = pairs[0];
        const span = pairs[1];
        return items.map(
            (it) => { return typeof it === "string" && it.length !== 1 ? span : 2; }
        );
    }
);


const gridColumnIndexes = gridColumnSpans.map((it) => { return scan(it, plus, 1) });


const gridRowIndexs = zip(
    EnglishKeyboard.map(length),
    range(0, EnglishKeyboard.length)
).map((it) => { return replicate(it[0], 2 * it[1] + 1) });

const KeyboardModel = zip4_2D(EnglishKeyboard, gridRowIndexs, gridColumnIndexes, gridColumnSpans);

function createKeyView(keyText) {
    const keyview = document.createElement("div");

    if (Array.isArray(keyText) && keyText.length === 2) {

        const top = document.createElement("div");
        const down = document.createElement("div");

        top.textContent = keyText[0];
        down.textContent = keyText[1];

        keyview.appendChild(top);
        keyview.appendChild(down);
    }
    else if (typeof keyText === "string") {
        keyview.textContent = keyText;
    }
    else {
        throw new TypeError("expect string or array");
    }

    return keyview;
}

function cssGridPosition(row, rowSpan, column, columnSpan) {
    console.assert(Number.isInteger(row) && Number.isInteger(rowSpan) &&
        Number.isInteger(column) && Number.isInteger(columnSpan));
    return `
        grid-row-start: ${row};
        grid-column-start: ${column};
        grid-row-end: span ${rowSpan};
        grid-column-end: span ${columnSpan};
    `;
}
let tip = null;
let keyboardMap = null;
function updatePromt() {
    keyboardMap = createKeyboardMap(keyboard);
    tip = randomInt(26);
    keyboard.children[keyboardMap[tip][0]].style.backgroundColor = "pink";
}
function createKeyboardView() {
    const keyboard = document.getElementById("keyboard");
    console.assert(keyboard != null);

    for (const row of KeyboardModel) {
        for (const key of row) {
            const text = key[0];
            const rowIndex = key[1];
            const colIndex = key[2];
            const colspan = key[3];
            const keyview = createKeyView(text);
            keyview.style = cssGridPosition(rowIndex, 2, colIndex, colspan);
            keyboard.appendChild(keyview);
        }
    }
    updatePromt();
}

document.addEventListener("DOMContentLoaded", createKeyboardView);

const inputbox = document.getElementById("input-box");
const keyboard = document.getElementById("keyboard");


function createKeyboardMap(keyboard) {
    let result = []

    for (let i = 0; i < keyboard.children.length; i++) {
        const keyview = keyboard.children[i];
        if (keyview.textContent.length === 1) {
            result.push([i, keyview.textContent]);
        }
    }
    return result;
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function inputbox_EventHandler(e) {

    if (inputbox.value.length === 2) {
        inputbox.value = inputbox.value[1];
    }

    if (keyboardMap[tip][1] === inputbox.value.toUpperCase()) {
        keyboard.children[keyboardMap[tip][0]].style.backgroundColor = null;
        updatePromt();
    }

}

inputbox.addEventListener("input", inputbox_EventHandler);