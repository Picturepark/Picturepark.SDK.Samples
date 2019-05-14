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
        this.counter = data.counter;
        this.para1 = data.para1;
        this.para2 = data.para2;
        this.article = data.article;
        this.page = data.page;
    }
    return ArticleHandler;
}());
//article overflow handler
loadElement();
function overflowHanlder() {
    var articleHandler = new ArticleHandler({
        counter: document.getElementsByClassName("article-box").length,
        para1: 0,
        para2: 9,
        article: document.getElementsByClassName("article-box"),
        page: [1, 2]
    });
    console.log("article counter = " + articleHandler.counter);
    console.log("para1 = " + articleHandler.para1);
    console.log("para2 = " + articleHandler.para2);
    console.log("article = " + articleHandler.article);
    console.log("page = " + articleHandler.page);
    console.log(document.getElementsByClassName("article-box"));
}
//load element function
function loadElement() {
    if (document.getElementsByClassName("article-box").length == 0) {
        window.requestAnimationFrame(loadElement);
    }
    else {
        overflowHanlder();
    }
}
//button function
function clickOpenBtn(btnEl, childEl) {
    var button = new Button({
        id: btnEl,
        content: childEl
    });
    button.content.style.display = "block";
    document.addEventListener("click", function () {
        button.content.style.display = "none";
    });
    button.id.addEventListener("click", function (ev) {
        button.content.style.display = "block";
        ev.stopPropagation();
    });
}
//header white on scroll
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
//activate search on search button click
//toggle mobile navigation
//# sourceMappingURL=functions.js.map