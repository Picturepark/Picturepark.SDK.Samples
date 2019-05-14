
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
    counter: number;
    para1: number;
    para2: number;
    article: HTMLCollection;
    page: [];

    constructor(data?: any) {
        this.counter = data.counter;
        this.para1 = data.para1;
        this.para2 = data.para2;
        this.article = data.article as HTMLCollection;
        this.page = data.page
    }
}

//article overflow handler
loadElement();

function overflowHanlder() {
    const articleHandler = new ArticleHandler({
        counter: document.getElementsByClassName("article-box").length as number,
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


