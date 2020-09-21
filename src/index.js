"use strict";
import "./css/style.css";

import settings from "./settings.js";
import gameFunction from "./game.js";

function starter(window, document) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        settings[key] = value;
    }
    settings.size = urlParams.get('size') ? parseInt(urlParams.get('size'), 10) : settings.size;
    gameFunction(window, document, settings, urlParams);
}

function launch(f, window, document) {
    if (document.readyState !== 'loading') {
        f(window, document);
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            f(window, document);
        });
    }
}

launch(starter, window, document);
