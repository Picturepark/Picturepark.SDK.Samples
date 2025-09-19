var ScrollPosition = /** @class */ (function () {
    function ScrollPosition(data) {
        this.element = document.getElementsByClassName("header-top-row")[0],
            this.posY = window.scrollY,
            this.posX = data.posX;
    }
    return ScrollPosition;
}());
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
var Button = /** @class */ (function () {
    function Button(data) {
        this.id = data.id;
        this.content = data.content;
    }
    return Button;
}());
var ArticleHandler = /** @class */ (function () {
    function ArticleHandler(data) {
        this.article = document.getElementsByClassName("article-box");
        this.articleCount = document.getElementsByClassName("article-box").length;
        this.pageCount = Math.ceil(document.getElementsByClassName("article-box").length / 9);
        this.pageId = [];
        this.pageName = [];
        for (var i = 0; i < this.articleCount; i++) { //check current page
            if (!this.article[i].classList.contains("hide-element")) {
                this.currentPage = parseInt(this.article[i].className[this.article[i].className.length - 1]);
            }
        }
        this.pageList = document.getElementsByClassName("page-list")[0];
    }
    return ArticleHandler;
}());
var Language = /** @class */ (function () {
    function Language(data) {
        this.currentLanguage = document.querySelector(".menu-item-language-current .no-text-link span").innerHTML;
        this.clickHereDemoLink = document.querySelector(".header-entry-subtitle a");
        this.privacyLink = document.querySelector("#terms-footer .privacy");
        this.aupLink = document.querySelector("#terms-footer .aup");
        this.companyWebsite = document.querySelector("#links-footer .company-website");
        this.supportLink = document.querySelector("#links-footer .support-link");
        this.moreInfoBtnLink = document.querySelector(".more-info-btn a");
    }
    return Language;
}());
//language (not changeable in resources)
var time = 1;
var interval = setInterval(function () {
    if (time <= 10) {
        time = time + 1;
    }
    else {
        languageChange();
        clearInterval(interval);
    }
}, 100);
function languageChange() {
    var language = new Language({});
    switch (language.currentLanguage) {
        case "En":
            language.clickHereDemoLink.setAttribute("href", "https://picturepark.com/try-picturepark-now/finefoods/");
            language.moreInfoBtnLink.setAttribute("href", "https://picturepark.com/try-picturepark-now/finefoods/");
            language.privacyLink.setAttribute("href", "https://go.fotoware.com/go/?l=AltoPP");
            language.aupLink.setAttribute("href", "https://go.fotoware.com/go/?l=AltoAUP");
            language.companyWebsite.setAttribute("href", "https://picturepark.com");
            language.supportLink.setAttribute("href", "https://picturepark.com/company/picturepark-customer-support/");
            break;
        case "De":
            language.clickHereDemoLink.setAttribute("href", "https://picturepark.com/de/picturepark-jetzt-testen/finefoods/");
            language.moreInfoBtnLink.setAttribute("href", "https://picturepark.com/de/picturepark-jetzt-testen/finefoods/");
            language.privacyLink.setAttribute("href", "https://go.fotoware.com/go/?l=AltoPP-de");
            language.aupLink.setAttribute("href", "https://go.fotoware.com/go/?l=AltoAUP-de");
            language.companyWebsite.setAttribute("href", "https://picturepark.com/de/");
            language.supportLink.setAttribute("href", "https://picturepark.com/de/unternehmen/picturepark-kundensupport/");
            break;
    }
}
//check if downloads exist
var downloadElements = document.getElementsByClassName("download-item");
setTimeout(function () {
    if (document.getElementsByClassName("article-detail").length != 0 && downloadElements.length == 0) {
        var downloadWrapper = document.getElementById("download-wrapper");
        downloadWrapper.classList.add("hide-element");
    }
}, 200);
//disable mail in add2any as there's a bug (not our fault)
setTimeout(function () {
    a2aAdjust(); //is used at 2 points
}, 200);
function a2aAdjust() {
    var a2aMAil = document.getElementsByClassName("a2a_s_email");
    var a2aParent = [];
    for (var i = 0; i < a2aMAil.length; i++) {
        a2aParent[i] = a2aMAil[i].parentNode;
        a2aParent[i].classList.add("hide-element");
    }
}
//viewport and mobile support
function mobileNavOpen() {
    var mobileElements = new MobileElements({});
    var scrollPosition = new ScrollPosition({});
    mobileElements.mobileBanner.style.marginTop = "70px";
    mobileElements.mobileInnerNav.style.animationName = "navIn";
    scrollPosition.element.style.animationName = "searchHeaderIn";
    mobileElements.mobileSearch.append(mobileElements.searchWrapper);
    mobileElements.mobileMoreInfo.append(mobileElements.moreInfo);
    mobileElements.mobileNavLinks.append(mobileElements.navLinks);
    mobileElements.mobileInnerNav.classList.remove("hide-element");
    mobileElements.mobileClose.classList.remove("hide-element");
    mobileElements.mobileMenu.classList.add("hide-element");
    scrollPosition.element.classList.add("gradient-shadow", "header-scroll-position");
    mobileElements.searchWrapper.getElementsByClassName("clear-search")[0].setAttribute("onclick", "mobileNavClose()");
}
function mobileNavClose() {
    var mobileElements = new MobileElements({});
    var scrollPosition = new ScrollPosition({});
    mobileElements.mobileInnerNav.style.animationName = "navOut";
    setTimeout(function () {
        mobileElements.mobileInnerNav.classList.add("hide-element");
        mobileElements.mobileClose.classList.add("hide-element");
        mobileElements.mobileMenu.classList.remove("hide-element");
        scrollPosition.element.style.animationName = "searchHeaderOut";
        mobileElements.mobileBanner.style.marginTop = "-30px";
        scrollPosition.element.style.animationName = "fade";
    }, 450);
    if (scrollPosition.posY < 500) {
        scrollPosition.element.classList.remove("gradient-shadow", "header-scroll-position");
    }
}
//mobile support
var time2 = 1;
var interval2 = setInterval(function () {
    if (time2 <= 10 && document.getElementsByTagName("body").length < 1) {
        time2 = time2 + 1;
    }
    else {
        isMobileDevice();
        clearInterval(interval2);
    }
}, 100);
function isMobileDevice() {
    if (typeof window.orientation !== "undefined" || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
        document.getElementsByTagName("body")[0].classList.add("vp-mobile");
        document.getElementsByTagName("head")[0].innerHTML += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
    }
    else {
        document.getElementsByTagName("body")[0].classList.remove("vp-mobile");
    }
}
//article overflow handler
loadElement();
function overflowHanlder() {
    var articleHandler = new ArticleHandler({});
    if (articleHandler.articleCount > 9) {
        for (var i = 0; i < articleHandler.pageCount; i++) { //fill array with pages
            articleHandler.pageId.push(i + 1);
            articleHandler.pageName.push("pageNr" + (i + 1));
            //create page numbers
            var node = document.createElement("div");
            node.setAttribute("onclick", "changePage(this.id)");
            node.classList.add("page-number");
            node.id = "page-nav-nr" + (i + 1);
            node.innerHTML = (i + 1).toString();
            articleHandler.pageList.append(node);
        }
        if (articleHandler.pageCount > 4) { //only display so many page numbers
            for (var i = 4; i < articleHandler.pageCount; i++) {
                document.getElementsByClassName("page-number")[i].classList.add("hide-element");
            }
            //make this function dynamic
            var node = document.createElement("div");
            node.classList.add("page-number");
            node.innerHTML = "...";
            articleHandler.pageList.append(node);
        }
        document.getElementById("page-nav-nr1").classList.add("active-page", "gradient-bckgr", "gradient-shadow"); //hardcoded: give current page class "active" or skomething like that
        //assign articles to pages
        var para1 = 0;
        var para2 = 9;
        for (var i = 0; i < articleHandler.articleCount; i++) {
            if (i < para2) {
                articleHandler.article[i].classList.add(articleHandler.pageName[para1]);
            }
            else {
                para1 = para1 + 1;
                para2 = para2 + 9;
                articleHandler.article[i].classList.add(articleHandler.pageName[para1]);
            }
            if (!articleHandler.article[i].classList.contains("pageNr1")) { //initial hide articles
                articleHandler.article[i].classList.add("hide-element");
            }
        }
        document.getElementsByClassName("last-page")[0].classList.add("hide-element");
    }
    else {
        document.getElementsByClassName("next-page")[0].classList.add("hide-element");
        document.getElementsByClassName("last-page")[0].classList.add("hide-element");
    }
}
function changePage(clickedPage) {
    var articleHandler = new ArticleHandler({});
    switch (clickedPage) {
        case "nextPageBtn":
            articleHandler.currentPage = articleHandler.currentPage + 1;
            break;
        case "lastPageBtn":
            articleHandler.currentPage = articleHandler.currentPage - 1;
            break;
        default:
            articleHandler.currentPage = parseInt(clickedPage[clickedPage.length - 1]);
            break;
    }
    for (var i = 0; i < articleHandler.articleCount; i++) {
        if (articleHandler.article[i].classList.contains("pageNr" + articleHandler.currentPage)) {
            articleHandler.article[i].classList.remove("hide-element");
        }
        else {
            articleHandler.article[i].classList.add("hide-element");
        }
    }
    for (var i = 1; i <= articleHandler.pageCount; i++) {
        if (i == articleHandler.currentPage) {
            document.getElementById("page-nav-nr" + articleHandler.currentPage).classList.add("active-page", "gradient-bckgr", "gradient-shadow");
        }
        else {
            if (document.getElementsByClassName("page-number")[i - 1].classList.contains("active-page")) {
                document.getElementsByClassName("page-number")[i - 1].classList.remove("active-page", "gradient-bckgr", "gradient-shadow");
            }
        }
    }
    window.scroll({ top: 0, behavior: 'smooth' });
    switch (articleHandler.currentPage) { //hide and display page nav btns
        case 1:
            document.getElementsByClassName("next-page")[0].classList.remove("hide-element");
            document.getElementsByClassName("last-page")[0].classList.add("hide-element");
            break;
        case articleHandler.pageCount:
            document.getElementsByClassName("next-page")[0].classList.add("hide-element");
            document.getElementsByClassName("last-page")[0].classList.remove("hide-element");
            break;
        default:
            document.getElementsByClassName("next-page")[0].classList.remove("hide-element");
            document.getElementsByClassName("last-page")[0].classList.remove("hide-element");
            break;
    }
}
function loadElement() {
    if (document.getElementsByClassName("article-box").length == 0) {
        window.requestAnimationFrame(loadElement);
    }
    else {
        overflowHanlder();
    }
}
function clickOpenBtn(btnEl, childEl) {
    var button = new Button({
        id: btnEl,
        content: childEl
    });
    setTimeout(function () {
        openItem();
        document.addEventListener("click", function (ev) {
            closeItem();
            ev.stopPropagation();
        });
        button.content.getElementsByClassName("close-icon")[0].addEventListener("click", function (ev) {
            closeItem();
            ev.stopPropagation();
        });
        button.id.addEventListener("click", function (ev) {
            openItem();
            ev.stopPropagation();
        });
    }, 10);
    function closeItem() {
        button.content.classList.add("visually-hidden");
        setTimeout(function () {
            button.content.classList.add("hide-element");
        }, 500);
    }
    function openItem() {
        button.content.classList.remove("visually-hidden");
        button.content.classList.remove("hide-element");
    }
}
function search(btnEl, childEl, inputEl) {
    var button = new Button({
        id: btnEl,
        content: childEl
    });
    var clearSearch = document.getElementsByClassName("clear-search")[0];
    setTimeout(function () {
        clearSearch.classList.remove("hide-element");
        button.id.classList.add("gradient-shadow", "search-active");
        button.content.classList.remove("visually-hidden", "hide-element");
        inputEl.focus();
        document.addEventListener("click", function () {
            clearSearch.classList.add("hide-element");
            button.content.classList.add("visually-hidden");
            setTimeout(function () {
                button.id.classList.remove("gradient-shadow", "search-active");
                button.content.classList.add("hide-element");
            }, 500);
        });
        button.id.addEventListener("click", function (ev) {
            clearSearch.classList.remove("hide-element");
            button.id.classList.add("gradient-shadow", "search-active");
            button.content.classList.remove("visually-hidden", "hide-element");
            inputEl.focus();
            ev.stopPropagation();
        });
        clearSearch.addEventListener("click", function () {
            inputEl.value = "";
        });
    }, 10);
}
window.addEventListener("scroll", function () {
    var timeout;
    if (!timeout) {
        timeout = setTimeout(function () {
            timeout = null; //reset timeout
            var scrollPosition = new ScrollPosition({});
            if (scrollPosition.posY > 500) {
                scrollPosition.element.classList.add("gradient-shadow");
                scrollPosition.element.classList.add("header-scroll-position");
                scrollPosition.element.classList.add("active");
            }
            else {
                if (!document.getElementsByClassName("mobile-inner-nav")[0].classList.contains("hide-element")) {
                    return;
                }
                else {
                    scrollPosition.element.classList.remove("gradient-shadow");
                    scrollPosition.element.classList.remove("header-scroll-position");
                    scrollPosition.element.classList.remove("active");
                }
            }
        }, 100);
    }
});
function backToTop() {
    window.scroll({ top: 0, behavior: 'smooth' });
}
//# sourceMappingURL=functions.js.map