"use strict";
var ShopJson;
(function (ShopJson) {
    window.addEventListener("load", init);
    let body;
    let articleDiv;
    var Article = ShopJson.Article;
    function init() {
        body = document.querySelector(".warenbody");
        buildArticles();
    }
    function buildArticles() {
        console.log(localStorage);
        let parsed;
        for (let index = 0; index < localStorage.length; index++) {
            let key = localStorage.key(index);
            let articleJson = localStorage.getItem(key);
            parsed = JSON.parse(articleJson);
            let article = Article.createFromJSON(parsed);
            articleDiv = article.buildDiv();
            body.append(articleDiv);
            console.log(articleDiv);
        }
    }
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Cart.js.map