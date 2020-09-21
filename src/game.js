"use strict"; // jshint ;_;
function stub() {
}


function randomIndex(length) {
    return Math.floor(Math.random() * length);
}

export default function game(window, document, settings, urlParams) {

function engine() {
    const w = settings.size;
    const h = settings.size;
    let moveCount = 0;
    const horseDirections = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const horseDirectionsNames = ["Влево", "Вниз", "Вправо", "Вверх"];
    const isInField = (posX, posY, d) => posX + d[0] >= 0 && posX + d[0] < w && posY + d[1] >= 0 && posY + d[1] < h;
    const hedgehog = function () {
        let posX = 0;
        let posY = h - 1;
        const getPosX = () => posX;
        const getPosY = () => posY;
        const tryMove = (i) => {
            const x = Math.floor(i % w);
            const y = Math.floor(i / w);
            if (Math.abs(posX - x) <= 1 && Math.abs(posY - y) <= 1) {
                if (x >= 0 && x < w) {
                    if (y >= 0 && y < h) {
                        posX = x;
                        posY = y;
                        return true;
                    }
                }
            }
            return false;
        }
        return {getPosX: getPosX, getPosY: getPosY, tryMove: tryMove}
    }();
    const horse = function () {
        let posX = randomIndex(w);
        let posY = randomIndex(h);
        let lastMove = "left";
        const getPosX = () => posX;
        const getPosY = () => posY;
        const getLastMove = () => lastMove;
        const move = function () {
            do {
                const ind = randomIndex(horseDirections.length);
                let d = horseDirections[ind];
                if (isInField(posX, posY, d)) {
                    lastMove = horseDirectionsNames[ind];
                    posX = posX + d[0];
                    posY = posY + d[1];
                    ++moveCount;
                    return true;
                }
            } while (true);
        }
        return {getPosX: getPosX, getPosY: getPosY, move: move, getLastMove: getLastMove}
    }()

    const isHedgehogPos = (i) => {
        return (i % w) === hedgehog.getPosX() && Math.floor(i / w) === hedgehog.getPosY()
    }

    const isHorsePos = (i) => {
        return (i % w) === horse.getPosX() && Math.floor(i / w) === horse.getPosY()
    }

    const getMoveCount = () => moveCount;

    const isWin = () => horse.getPosX() === hedgehog.getPosX() && horse.getPosY() === hedgehog.getPosY();

    return {
        w: w,
        h: h,
        hedgehog: hedgehog,
        horse: horse,
        isHedgehogPos: isHedgehogPos,
        isHorsePos: isHorsePos,
        isWin: isWin,
        getMoveCount: getMoveCount
    }
}

const handleClick = function (evt, parent) {
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
};

function draw(presenter, box, message, settings) {
    for (let i = 0; i < presenter.w * presenter.h; i++) {
        const tile = box.childNodes[i];
        tile.className = 'cell';
        if (presenter.isHedgehogPos(i)) {
            tile.innerHTML = "<span>&#129428;</span>";
        } else if (presenter.isHorsePos(i) && settings.isHorseVisible) {
            tile.innerHTML = "<span>&#128052;</span>";
        } else {
            tile.innerHTML = ""
        }
    }
    if (message) {
        message.innerText = presenter.horse.getLastMove();
    }
}


    const box = document.getElementsByClassName("box")[0];
    const message = document.querySelector(".message");
    const overlay = document.getElementsByClassName("overlay")[0];
    const close = document.getElementsByClassName("close")[0];


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

    function onGameEnd(eng) {
        const message = "You win";
        const h2 = overlay.querySelector('h2');
        h2.textContent = message;
        const content = overlay.querySelector('.content');
        content.textContent = "Result =  " + eng.getMoveCount();
        overlay.classList.add('show');
        handlers['gameover'](eng.getMoveCount());
    }


    const g = engine();

    initField(g.w * g.h, 'cell', box);
    g.horse.move();
    draw(g, box, message, settings);
    if (g.isWin()) {
        onGameEnd(g);
    }

    const handleBox = function (evt) {
        const ind = handleClick(evt, box);

        console.log(ind);
        if (g.hedgehog.tryMove(ind)) {
            if (g.isWin()) {
                onGameEnd(g);
            } else {
                g.horse.move();
                if (g.isWin()) {
                    onGameEnd(g);
                }
            }
            draw(g, box, message, settings);
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
