"use strict";
var ShopJson;
(function (ShopJson) {
    window.addEventListener("load", init);
    let container;
    let articleDiv;
    let counterLi;
    let totalPrice;
    function init(_event) {
        container = document.querySelector("h2 + div");
        counterLi = document.querySelector(".counterCart");
        updateArticles();
    }
    function updateArticles() {
        console.log("update");
        container.innerHTML = "";
        totalPrice = 0;
        for (let index = 0; index < localStorage.length; index++) {
            let key = localStorage.key(index);
            let articleJson = localStorage.getItem(key);
            let parsed = JSON.parse(articleJson);
            let article = ShopJson.Article.createFromJSON(parsed);
            totalPrice += article.price;
            articleDiv = article.buildDiv(false);
            container.append(articleDiv);
        }
        updateCounter();
    }
    ShopJson.updateArticles = updateArticles;
    function updateCounter() {
        console.log(totalPrice);
        counterLi.setAttribute("style", totalPrice <= 0 ? "display:none !important" : "display:inline-block !important");
        counterLi.innerHTML = totalPrice <= 0 ? "" : totalPrice + "€";
        if (totalPrice <= 0) {
            container.innerHTML = "Der Einkaufswagen ist leer";
            container.style.font = "22px Arial, sans-serif";
        }
    }
    ShopJson.updateCounter = updateCounter;
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Cart.js.map