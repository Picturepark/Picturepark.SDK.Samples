export class ArticleHandler {
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