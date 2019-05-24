
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
        this.element = document.getElementsByClassName("header-first-row")[0] as HTMLElement,
        this.posY = window.scrollY,
        this.posX = data.posX;
    }
}

class ArticleHandler {
    article: HTMLCollection;
    articleCount: number;
    pageCount: number;
    pageId: number[];
    pageName: string[];
    currentPage: number;
    pageList: HTMLElement;

    constructor(data?: any) {
        this.article = document.getElementsByClassName("article-box") as HTMLCollection;
        this.articleCount = document.getElementsByClassName("article-box").length as number;
        this.pageCount = Math.ceil(document.getElementsByClassName("article-box").length as number / 9);
        this.pageId = [];
        this.pageName = [];
        for (let i = 0; i < this.articleCount; i++) { //check current page
            if (!this.article[i].classList.contains("hide-element")) {
                this.currentPage = parseInt(this.article[i].className[this.article[i].className.length - 1]);
            }
        }

        this.pageList = document.getElementsByClassName("page-list")[0] as HTMLElement;
    }
}

class MobileElements {
    mobileInnerNav: HTMLElement;
    mobileSearch: HTMLElement;
    mobileMoreInfo: HTMLElement;
    mobileNavLinks: HTMLElement;
    mobileMenu: HTMLElement;
    mobileClose: HTMLElement;
    searchWrapper: HTMLElement;
    moreInfo: HTMLElement;
    navLinks: HTMLElement;

    constructor(data?: any) {
        this.mobileInnerNav = document.getElementsByClassName("mobile-inner-nav")[0] as HTMLElement;
        this.mobileSearch = document.getElementsByClassName("mobile-search")[0] as HTMLElement;
        this.mobileMoreInfo = document.getElementsByClassName("mobile-more-info")[0] as HTMLElement;
        this.mobileNavLinks = document.getElementsByClassName("mobile-nav-links")[0] as HTMLElement;
        this.mobileMenu = document.getElementsByClassName("menu-icon")[0] as HTMLElement;
        this.mobileClose = document.getElementsByClassName("close-icon")[0] as HTMLElement;
        this.searchWrapper = document.getElementById("searchWrapper") as HTMLElement;
        this.moreInfo = document.getElementById("more-info-btn") as HTMLElement;
        this.navLinks = document.getElementsByClassName("nav-links")[0] as HTMLElement;
    }
}

//viewport and mobile support
function mobileNavOpen() {
    const mobileElements = new MobileElements({});
    const scrollPosition = new ScrollPosition({});

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
    const mobileElements = new MobileElements({});
    const scrollPosition = new ScrollPosition({});

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
    const articleHandler = new ArticleHandler({});

    if (articleHandler.articleCount > 9) {
        for (let i = 0; i < articleHandler.pageCount; i++) { //fill array with pages
            articleHandler.pageId.push(i + 1);
            articleHandler.pageName.push("pageNr" + (i + 1));

            //create page numbers
            let node: HTMLElement = document.createElement("div");
            node.setAttribute("onclick", "changePage(this.id)");
            node.classList.add("page-number");
            node.id = "page-nav-nr" + (i + 1);
            node.innerHTML = (i + 1).toString();
            articleHandler.pageList.append(node);
        }

        if (articleHandler.pageCount > 4) { //only display so many page numbers
            for (let i = 4; i < articleHandler.pageCount; i++) {
                document.getElementsByClassName("page-number")[i].classList.add("hide-element");
                console.log(i);
            }

            //make this function dynamic
            let node: HTMLElement = document.createElement("div");
            node.classList.add("page-number");
            node.innerHTML = "...";
            articleHandler.pageList.append(node);
        }

        document.getElementById("page-nav-nr1").classList.add("active-page", "gradient-bckgr", "gradient-shadow"); //hardcoded: give current page class "active" or skomething like that

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

function changePage(clickedPage) { //page navigation
    const articleHandler = new ArticleHandler({});

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

    for (let i = 0; i < articleHandler.articleCount; i++) {
        if (articleHandler.article[i].classList.contains("pageNr" + articleHandler.currentPage)){
            articleHandler.article[i].classList.remove("hide-element");
        }
        else {
            articleHandler.article[i].classList.add("hide-element");
        }
    }

    for (let i = 1; i <= articleHandler.pageCount; i++) {
        console.log(articleHandler.currentPage);
        if (i == articleHandler.currentPage) {
            document.getElementById("page-nav-nr" + articleHandler.currentPage).classList.add("active-page", "gradient-bckgr", "gradient-shadow");
        }
        else {
            if (document.getElementsByClassName("page-number")[i-1].classList.contains("active-page")){
                document.getElementsByClassName("page-number")[i-1].classList.remove("active-page", "gradient-bckgr", "gradient-shadow");
            }
        }
    }

    window.scroll({top: 0, behavior: 'smooth'});

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

function loadElement() { //wait until articles are loaded
    if (document.getElementsByClassName("article-box").length == 0) {
        window.requestAnimationFrame(loadElement); 
    }
    else {
        overflowHanlder();
    }
}

function clickOpenBtn(btnEl, childEl) { //button function
    const button = new Button({
        id: btnEl as HTMLElement,
        content: childEl as HTMLElement
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

window.addEventListener("scroll", function () { //header white on scroll
    let timeout: number;
    if (!timeout) {
        timeout = setTimeout(function () {
            timeout = null; //reset timeout
            const scrollPosition = new ScrollPosition({});

            if (scrollPosition.posY > 500) {
                scrollPosition.element.classList.add("gradient-shadow");
                scrollPosition.element.classList.add("header-scroll-position");
            }
            else {
                if (!document.getElementsByClassName("mobile-inner-nav")[0].classList.contains("hide-element")) {
                    return;
                }
                else {
                    scrollPosition.element.classList.remove("gradient-shadow");
                    scrollPosition.element.classList.remove("header-scroll-position");
                }
            }
        }, 100)
    }
});


//toggle mobile navigation