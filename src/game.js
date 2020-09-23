"use strict"; // jshint ;_;
function stub() {
}


function randomIndex(length) {
    return Math.floor(Math.random() * length);
}

function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function numAndDeclOfNum(number, titles) {
    return number + " " + declOfNum(number, titles);
}

function engine(w, h) {
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
    const onHedgehog = (posX, posY, d) => posX + d[0] === hedgehog.getPosX() && posY + d[1] === hedgehog.getPosY();
    const horse = function () {
        let posX = randomIndex(w);
        let posY = randomIndex(h);
        while (posX === hedgehog.getPosX() && posY === hedgehog.getPosY()) {
            posX = randomIndex(w);
            posY = randomIndex(h);
        }
        let lastMove = "left";
        const getPosX = () => posX;
        const getPosY = () => posY;
        const getLastMove = () => lastMove;
        const move = function () {
            const availableInd = [];
            let ind = 0;
            for (const d of horseDirections) {
                if (isInField(posX, posY, d) && !onHedgehog(posX, posY, d)) {
                    availableInd.push(ind)
                }
                ++ind;
            }

            ind = availableInd[randomIndex(availableInd.length)];
            let d = horseDirections[ind];
            lastMove = horseDirectionsNames[ind];
            posX = posX + d[0];
            posY = posY + d[1];
            ++moveCount;

        }
        return {getPosX: getPosX, getPosY: getPosY, move: move, getLastMove: getLastMove}
    }()

    const isXPosition = (i, x) => (i % w) === x.getPosX() && Math.floor(i / w) === x.getPosY()
    const isHedgehogPos = (i) => isXPosition(i, hedgehog);
    const isHorsePos = (i) => isXPosition(i, horse);
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
    const avHorses = ["&#128052;", "&#128014;", "&#127904;"];
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
                    const text = "<span>" + horseText + "</span>";
                    const text2 = `<span>${horseText}</span>`
                    console.log(text);
                    console.log(text2);
                    tile.innerHTML = text;
                }
            }
        } else {
            tile.innerHTML = ""
        }
    }
    if (message) {
        message.innerText = presenter.horse.getLastMove();
    }
}

export default function game(window, document, settings, urlParams) {

    const box = document.getElementsByClassName("box")[0];
    const message = document.querySelector(".message");
    const overlay = document.getElementsByClassName("overlay")[0];
    const close = document.getElementsByClassName("close")[0];

    let size = 8; // default
    if (settings.size) {
        size = parseInt(settings.size, 10);
        let root = document.documentElement;
        root.style.setProperty('--field-size', size);
    }

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


    const g = engine(size, size);

    function onGameEnd() {
        const message = "Нашлась!";
        const h2 = overlay.querySelector('h2');
        h2.textContent = message;
        const content = overlay.querySelector('.content');
        content.textContent = "За  " + numAndDeclOfNum(g.getMoveCount(), ['ход', 'хода', 'ходов']);
        overlay.classList.add('show');
        handlers['gameover'](g.getMoveCount());
    }

    initField(g.w * g.h, 'cell', box);
    g.horse.move();
    draw(g, box, message, settings);
    if (g.isWin()) {
        // should never happen
        onGameEnd();
    }

    const handleBox = function (evt) {
        const ind = handleClick(evt, box);
        if (g.hedgehog.tryMove(ind)) {
            if (g.isWin()) {
                onGameEnd();
            } else {

                g.horse.move();
                if (g.isWin()) {
                    // should never happen
                    onGameEnd();
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
