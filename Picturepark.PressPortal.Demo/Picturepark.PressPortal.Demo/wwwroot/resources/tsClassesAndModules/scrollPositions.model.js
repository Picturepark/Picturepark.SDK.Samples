"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScrollPosition = /** @class */ (function () {
    function ScrollPosition(data) {
        this.element = document.getElementsByClassName("header-top-row")[0],
            this.posY = window.scrollY,
            this.posX = data.posX;
    }
    return ScrollPosition;
}());
exports.ScrollPosition = ScrollPosition;
//# sourceMappingURL=scrollPositions.model.js.map