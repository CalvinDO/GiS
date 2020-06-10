"use strict";
var ShopJson;
(function (ShopJson) {
    window.addEventListener("load", init);
    let container;
    let articleDiv;
    var Article = ShopJson.Article;
    function init() {
        container = document.querySelector("h2 + div");
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
            container.append(articleDiv);
            console.log(articleDiv);
        }
    }
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Cart.js.map