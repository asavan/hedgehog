"use strict"; // jshint ;_;

import {playSound, numAndDeclOfNum, handleClick} from "./helper.js";
import engine from "./logic.js";

function stub() {
}


function draw(presenter, box, message, settings) {
    const avHorses = ["&#128052;", "&#128014;", "&#127904;", "&#127943;", "&#9816;", "&#9822;"];
    for (let i = 0; i < presenter.w * presenter.h; i++) {
        const tile = box.childNodes[i];
        tile.className = 'cell';
        if (presenter.isHedgehogPos(i)) {
            tile.innerHTML = "<span>&#129428;</span>";
            tile.classList.add('flip');
        } else if (presenter.isHorsePos(i)) {
            if (settings.horse) {
                const horseIndex = parseInt(settings.horse, 10) - 1;
                const horseText = avHorses[horseIndex];
                if (horseText) {
                    tile.innerHTML = `<span>${horseText}</span>`;
                }
            }
        } else {
            tile.innerHTML = ""
        }
    }
    if (message && presenter.getLastMove()) {
        message.innerText = presenter.getLastMove();
    }
}

export default function game(window, document, settings) {

    const box = document.getElementsByClassName("box")[0];
    const message = document.querySelector(".message");
    const overlay = document.getElementsByClassName("overlay")[0];
    const close = document.getElementsByClassName("close")[0];
    const tada = document.getElementById("tada");

    document.documentElement.style.setProperty('--field-size', settings.size);

    const handlers = {
        'playerMove': stub,
        'enemyMove': stub,
        'meMove': stub,
        'aiMove': stub,
        'aiHint': stub,
        'gameover': stub
    }

    function initField(fieldSize, className, elem) {
        for (let i = 0; i < fieldSize; i++) {
            const cell = document.createElement('div');
            cell.className = className;
            elem.appendChild(cell);
        }
    }


    const g = engine(settings.size, settings.size);

    function onGameEnd() {
        const content = overlay.querySelector('.content');
        content.textContent = "За  " + numAndDeclOfNum(g.getMoveCount(), ['ход', 'хода', 'ходов']);
        overlay.classList.add('show');
        handlers['gameover'](g.getMoveCount());
        if (settings.sound) {
            playSound(tada);
        }
    }

    function drawWithAnimation() {
        draw(g, box, message, settings);
        if (g.isWin()) {
            // should never happen
            onGameEnd();
        }
    }

    function nextStep() {
        function step() {
            g.horse.move();
            drawWithAnimation();
        }
        setTimeout(step, 200);
    }

    initField(g.w * g.h, 'cell', box);
    drawWithAnimation();
    nextStep();

    const handleBox = function (evt) {
        const ind = handleClick(evt, box);
        if (g.tryMoveToIndex(ind)) {
            drawWithAnimation();
            if (!g.isWin()) {
                nextStep();
            }
        }
    };

    box.addEventListener("click", handleBox, false);
    close.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.classList.remove("show");
    }, false);

    function on(name, f) {
        handlers[name] = f;
    }

    return {
        on: on
    }
}
