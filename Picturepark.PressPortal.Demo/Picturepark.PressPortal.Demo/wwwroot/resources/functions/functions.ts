
//classes
class Button {
    id: HTMLElement;
    content: HTMLElement;

    constructor(data?: any) {
        this.id = data.id;
        this.content = data.content;
    }
}

class ScrollPosition {
    element: HTMLElement;
    posY: number;
    posX: number;

    constructor(data?: any) {
        this.element = data.element as HTMLElement;
        this.posY = data.posY;
        this.posX = data.posX;
    }
}

class ArticleHandler {
    articleCount: number;
    pageCount: number;
    article: HTMLCollection;
    pageId: number[];
    pageName: string[];
    currentPage: number;

    constructor(data?: any) {
        this.articleCount = data.articleCount;
        this.pageCount = data.pageCount;
        this.article = data.article as HTMLCollection;
        this.pageId = data.pageId;
        this.pageName = data.pageName;
        this.currentPage = data.currentPage;
    }
}

//article overflow handler
loadElement();

function overflowHanlder() {
    const articleHandler = new ArticleHandler({
        articleCount: document.getElementsByClassName("article-box").length as number,
        pageCount: Math.ceil(document.getElementsByClassName("article-box").length as number / 9),
        article: document.getElementsByClassName("article-box"),
        pageId: [],
        pageName: [],
        currentPage: 1
    });

    if (articleHandler.articleCount > 9) {
        for (let i = 0; i < articleHandler.pageCount; i++) { //fill array with pages
            articleHandler.pageId.push(i + 1);
            articleHandler.pageName.push("pageNr" + (i + 1));
        }

        //assign articles to pages
        let para1: number = 0;
        let para2: number = 9;

        for (let i = 0; i < articleHandler.articleCount; i++) {
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

function loadElement() { //wait until articles are loaded
    if (document.getElementsByClassName("article-box").length == 0) {
        window.requestAnimationFrame(loadElement); 
    }
    else {
        overflowHanlder();
    }
}

//button function
function clickOpenBtn(btnEl, childEl) {
    const button = new Button({
        id: btnEl as HTMLElement,
        content: childEl as HTMLElement
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
    const scrollPosition = new ScrollPosition({
        posY: window.scrollY,
        element: document.getElementsByClassName("header-first-row")[0] as HTMLElement
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


