"use strict";
import "./css/style.css";

import settings from "./settings.js";
import gameFunction from "./game.js";
import {launchWithUrlParse} from "./helper.js";

launchWithUrlParse(window, document, settings, gameFunction);

// eslint-disable-next-line no-undef
if (__USE_SERVICE_WORKERS__) {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js", {scope: "./"});
    }
}
