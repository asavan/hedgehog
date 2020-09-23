"use strict";
function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}

function starter(window, document, settings, f) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        if (typeof settings[key] === "number") {
            settings[key] = parseInt(value, 10);
        } else if (typeof settings[key] === "boolean") {
            settings[key] = stringToBoolean(value);
        } else {
            settings[key] = value;
        }
    }
    f(window, document, settings);
}

function launch(f, window, document, settings, afterUrlParse) {
    if (document.readyState !== 'loading') {
        f(window, document, settings, afterUrlParse);
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            f(window, document, settings, afterUrlParse);
        });
    }
}

export function launchWithUrlParse(window, document, settings, afterUrlParse) {
    launch(starter, window, document, settings, afterUrlParse);
}


export function randomIndex(length) {
    return Math.floor(Math.random() * length);
}

export const playSound = (elem) => {
    if (!elem) return;
    elem.play();
}

export function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

export function numAndDeclOfNum(number, titles) {
    return number + " " + declOfNum(number, titles);
}

export function handleClick(evt, parent) {
    const getIndex = function (e, parent) {
        const target = e.target || e.srcElement;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === target) return i;
        }
        return -1;
    };

    evt.preventDefault();
    if (!(evt.target.classList.contains('cell') || evt.target.classList.contains('digit'))) {
        return;
    }
    return getIndex(evt, parent);
}
