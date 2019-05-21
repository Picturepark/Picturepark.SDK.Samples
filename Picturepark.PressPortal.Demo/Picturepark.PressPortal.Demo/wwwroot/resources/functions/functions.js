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
        this.element = data.element;
        this.posY = data.posY;
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
        articleHandler.pageCount = 12;
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
        //give current page class "active" or skomething like that
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
    button.content.classList.remove("hide-element");
    document.addEventListener("click", function () {
        button.content.classList.add("hide-element");
    });
    button.id.addEventListener("click", function (ev) {
        button.content.classList.remove("hide-element");
        ev.stopPropagation();
    });
}
window.addEventListener("scroll", function () {
    var scrollPosition = new ScrollPosition({
        posY: window.scrollY,
        element: document.getElementsByClassName("header-first-row")[0]
    });
    if (scrollPosition.posY > 500) {
        scrollPosition.element.classList.add("gradient-shadow");
        scrollPosition.element.classList.add("header-scroll-position");
    }
    else {
        scrollPosition.element.classList.remove("gradient-shadow");
        scrollPosition.element.classList.remove("header-scroll-position");
    }
});
//toggle mobile navigation
//# sourceMappingURL=functions.js.map