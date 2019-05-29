"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.ArticleHandler = ArticleHandler;
//# sourceMappingURL=articleHandler.model.js.map