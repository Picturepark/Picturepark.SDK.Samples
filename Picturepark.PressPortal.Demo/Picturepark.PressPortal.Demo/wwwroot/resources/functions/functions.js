//classes
var Button = /** @class */ (function () {
    function Button(data) {
        this.id = data.id;
        this.content = data.content;
    }
    return Button;
}());
var ScrollPosition = /** @class */ (function () {
    function ScrollPosition(data) {
        this.element = document.getElementsByClassName("header-first-row")[0],
            this.posY = window.scrollY,
            this.posX = data.posX;
    }
    return ScrollPosition;
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
var MobileElements = /** @class */ (function () {
    function MobileElements(data) {
        this.mobileInnerNav = document.getElementsByClassName("mobile-inner-nav")[0];
        this.mobileSearch = document.getElementsByClassName("mobile-search")[0];
        this.mobileMoreInfo = document.getElementsByClassName("mobile-more-info")[0];
        this.mobileNavLinks = document.getElementsByClassName("mobile-nav-links")[0];
        this.mobileMenu = document.getElementsByClassName("menu-icon")[0];
        this.mobileClose = document.getElementsByClassName("close-icon")[0];
        this.searchWrapper = document.getElementById("searchWrapper");
        this.moreInfo = document.getElementById("more-info-btn");
        this.navLinks = document.getElementsByClassName("nav-links")[0];
    }
    return MobileElements;
}());
//viewport and mobile support
function mobileNavOpen() {
    var mobileElements = new MobileElements({});
    var scrollPosition = new ScrollPosition({});
    mobileElements.mobileSearch.append(mobileElements.searchWrapper);
    mobileElements.mobileMoreInfo.append(mobileElements.moreInfo);
    mobileElements.mobileNavLinks.append(mobileElements.navLinks);
    mobileElements.mobileInnerNav.classList.remove("hide-element");
    mobileElements.mobileClose.classList.remove("hide-element");
    mobileElements.mobileMenu.classList.add("hide-element");
    scrollPosition.element.classList.add("gradient-shadow");
    scrollPosition.element.classList.add("header-scroll-position");
}
function mobileNavClose() {
    var mobileElements = new MobileElements({});
    var scrollPosition = new ScrollPosition({});
    mobileElements.mobileInnerNav.classList.add("hide-element");
    mobileElements.mobileClose.classList.add("hide-element");
    mobileElements.mobileMenu.classList.remove("hide-element");
    if (scrollPosition.posY < 500) {
        scrollPosition.element.classList.remove("gradient-shadow");
        scrollPosition.element.classList.remove("header-scroll-position");
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
                console.log(i);
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
        console.log(articleHandler.currentPage);
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
        button.content.classList.remove("visually-hidden");
        button.content.classList.remove("hide-element");
        document.addEventListener("click", function () {
            button.content.classList.add("visually-hidden");
            setTimeout(function () {
                button.content.classList.add("hide-element");
            }, 500);
        });
        button.id.addEventListener("click", function (ev) {
            button.content.classList.remove("visually-hidden");
            button.content.classList.remove("hide-element");
            ev.stopPropagation();
        });
    }, 10);
}
function search(btnEl, childEl) {
    var button = new Button({
        id: btnEl,
        content: childEl
    });
    setTimeout(function () {
        button.id.classList.add("gradient-shadow", "search-active");
        button.content.classList.remove("visually-hidden", "hide-element");
        document.addEventListener("click", function () {
            button.content.classList.add("visually-hidden");
            setTimeout(function () {
                button.id.classList.remove("gradient-shadow", "search-active");
                button.content.classList.add("hide-element");
            }, 500);
        });
        button.id.addEventListener("click", function (ev) {
            button.id.classList.add("gradient-shadow", "search-active");
            button.content.classList.remove("visually-hidden", "hide-element");
            ev.stopPropagation();
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
//toggle mobile navigation
//# sourceMappingURL=functions.js.map