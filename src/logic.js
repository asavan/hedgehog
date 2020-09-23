"use strict";

import {randomIndex} from "./helper.js";

export default function engine(w, h) {
    let moveCount = 0;
    let isHorseMove = true;
    const horseDirections = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const horseDirectionsNames = ["Влево", "Вниз", "Вправо", "Вверх"];
    const isInField = (posX, posY, d) => posX + d[0] >= 0 && posX + d[0] < w && posY + d[1] >= 0 && posY + d[1] < h;
    const hedgehog = function () {
        let posX = 0;
        let posY = h - 1;
        const getPosX = () => posX;
        const getPosY = () => posY;
        const tryMove = (x, y) => {
            if (isHorseMove) {
                return false;
            }

            if (Math.abs(posX - x) <= 1 && Math.abs(posY - y) <= 1) {
                if (x >= 0 && x < w) {
                    if (y >= 0 && y < h) {
                        posX = x;
                        posY = y;
                        isHorseMove = true;
                        return true;
                    }
                }
            }
            return false;
        }
        const move = (ind) => {
            if (isHorseMove) {
                return false;
            }
            let m = 0;
            for (let i = -1; i <= 1; ++i) {
                for(let j = -1; j<=1; ++j) {
                    if (m === ind) {
                        if (isInField(posX, posY, [j,i])) {
                            posX = posX + j;
                            posY = posY + i;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    ++m;
                }
            }
            return false;
        }
        return {getPosX: getPosX, getPosY: getPosY, tryMove: tryMove, move: move}
    }();
    const onHedgehog = (posX, posY, d) => posX + d[0] === hedgehog.getPosX() && posY + d[1] === hedgehog.getPosY();
    const horse = function () {
        let posX = randomIndex(w);
        let posY = randomIndex(h);
        while (posX === hedgehog.getPosX() && posY === hedgehog.getPosY()) {
            posX = randomIndex(w);
            posY = randomIndex(h);
        }
        let lastMoveIndex = -1;
        const getPosX = () => posX;
        const getPosY = () => posY;
        const getLastMoveIndex = () => lastMoveIndex;
        const move = function () {
            if (!isHorseMove) {
                console.log("Error");
                return;
            }
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
            lastMoveIndex = ind;
            posX = posX + d[0];
            posY = posY + d[1];
            ++moveCount;
            isHorseMove = false;
        }
        return {getPosX: getPosX, getPosY: getPosY, move: move, getLastMoveIndex: getLastMoveIndex}
    }()

    const isXPosition = (i, x) => (i % w) === x.getPosX() && Math.floor(i / w) === x.getPosY()
    const isHedgehogPos = (i) => isXPosition(i, hedgehog);
    const isHorsePos = (i) => isXPosition(i, horse);
    const getMoveCount = () => moveCount;

    const isWin = () => horse.getPosX() === hedgehog.getPosX() && horse.getPosY() === hedgehog.getPosY();

    const tryMoveToIndex = (i) => hedgehog.tryMove(i % w, Math.floor(i / w));

    const getLastMove = () => horseDirectionsNames[horse.getLastMoveIndex()];

    return {
        w: w,
        h: h,
        // hedgehog: hedgehog,
        horse: horse,
        isHedgehogPos: isHedgehogPos,
        isHorsePos: isHorsePos,
        isWin: isWin,
        tryMoveToIndex: tryMoveToIndex,
        getMoveCount: getMoveCount,
        getLastMove: getLastMove
    }
}