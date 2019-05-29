"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MobileElements = /** @class */ (function () {
    function MobileElements(data) {
        this.mobileInnerNav = document.getElementsByClassName("mobile-inner-nav")[0];
        this.mobileSearch = document.getElementsByClassName("mobile-search")[0];
        this.mobileMoreInfo = document.getElementsByClassName("mobile-more-info")[0];
        this.mobileNavLinks = document.getElementsByClassName("mobile-nav-links")[0];
        this.mobileMenu = document.getElementsByClassName("menu-icon")[0];
        this.mobileClose = document.getElementsByClassName("mobile-nav")[0].getElementsByClassName("close-icon")[0];
        this.mobileBanner = document.getElementsByClassName("mobile-header-banner")[0];
        this.searchWrapper = document.getElementsByClassName("searchWrapper")[0];
        this.moreInfo = document.getElementsByClassName("more-info-btn")[0];
        this.navLinks = document.getElementsByClassName("nav-links")[0];
    }
    return MobileElements;
}());
exports.MobileElements = MobileElements;
//# sourceMappingURL=mobileElements.model.js.map