import {numAndDeclOfNum, pluralize} from "./helper.js";

export default function translationFunc(lang) {
    function ruTranslation() {
        const horseDirectionsNames = ["Влево", "Вниз", "Вправо", "Вверх"];
        function getTitle() {
            return "Ёжик и Лошадка";
        }
        function getDescription() {
            return "Игра Ёжик и Лошадка";
        }

        function winHeader() {
            return "Нашлась!";
        }

        function installPrompt() {
            return "Установить как приложение";
        }

        function winMessage(moveCount) {
            return "За " + numAndDeclOfNum(moveCount, ['ход', 'хода', 'ходов']);
        }

        const getMove = (index) => horseDirectionsNames[index];
        return {
            getTitle, getDescription, getMove, winHeader, installPrompt, winMessage
        }
    }

    function engTranslation() {
        const horseDirectionsNames = ["Left", "Down", "Right", "Up"];
        function getTitle() {
            return "Hedgehog and Horse";
        }
        function getDescription() {
            return "Hedgehog and Horse game";
        }

        function winHeader() {
            return "Found";
        }

        function installPrompt() {
            return "Install as app";
        }

        function winMessage(moveCount) {
            return "in  " + pluralize(moveCount, "move");
        }

        const getMove = (index) => horseDirectionsNames[index];
        return {
            getTitle, getDescription, getMove, winHeader, installPrompt, winMessage
        }
    }

    if (lang === 'ru') {
        return ruTranslation();
    }
    return engTranslation();
}
