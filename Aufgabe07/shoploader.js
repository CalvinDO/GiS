"use strict";
var ShopJson;
(function (ShopJson) {
    window.addEventListener("load", init);
    ShopJson.articleCount = 0;
    ShopJson.priceCount = 0;
    //export let cart: Cart;
    let divs = [];
    let showIndex;
    let categorysJSON = [];
    let category = [];
    let categorys = [];
    function init(_event) {
        communicate("Articles.json");
        loadNavListeners();
        loadSearchListener();
    }
    async function communicate(_url) {
        let response = await fetch(_url);
        categorysJSON = await response.json();
        loadArticles(categorysJSON);
    }
    function loadArticles(_categories) {
        for (let categoryJSON of _categories) {
            category = [];
            for (let article of categoryJSON) {
                category.push(new ShopJson.Article(article.name, article.description, article.image, article.price, 1));
            }
            categorys.push(category);
        }
        let productsDiv = document.createElement("div");
        let index;
        for (let category of categorys) {
            index = categorys.indexOf(category) * 2 + 2;
            productsDiv = document.querySelector("h2:nth-child(" + index + ") + div");
            divs.push(productsDiv);
            for (let article of category) {
                productsDiv.append(article.buildDiv(true));
            }
        }
    }
    function loadNavListeners() {
        let navButton;
        let logo = document.querySelector("h1>a");
        logo.addEventListener("click", handleClickCategory.bind(logo));
        for (let liIndex = 1; liIndex < 4; liIndex++) {
            navButton = document.querySelector(".nav-list li:nth-child(" + liIndex + ") a");
            navButton.addEventListener("click", handleClickCategory.bind(navButton));
        }
    }
    function loadSearchListener() {
        let searchButton;
        let searchInput = document.querySelector("nav input");
        searchButton = document.querySelector("li:last-child a");
        searchButton.addEventListener("click", handleClickSearch.bind(searchInput));
    }
    function handleClickSearch(_event) {
        showElementsContaining(this.value);
    }
    function showElementsContaining(_substring) {
        console.log(_substring);
        let searchRegEx = new RegExp(_substring.toLowerCase());
        let name;
        let description;
        let bothKonkat;
        let articleDiv;
        let match;
        for (let category of categorys) {
            for (let article of category) {
                name = article.name;
                description = article.description;
                bothKonkat = name + description;
                articleDiv = document.querySelector("#" + name);
                match = searchRegEx.test(bothKonkat.toLowerCase());
                articleDiv.style.display = match ? "flex" : "none";
            }
        }
    }
    function handleClickCategory(_click) {
        let clickedAtt = this.getAttribute("href");
        switch (clickedAtt) {
            case "#Startseite":
                showIndex = -1;
                break;
            case "#Holzscheite":
                showIndex = 0;
                break;
            case "#Holzpellets":
                showIndex = 1;
                break;
            case "#Holzspäne":
                showIndex = 2;
                break;
        }
        for (let i = 0; i <= divs.length; i++) {
            let div = divs[i];
            if (showIndex != -1) {
                div.style.display = showIndex == i ? "flex" : "none";
            }
            else {
                div.style.display = "flex";
            }
        }
    }
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=shoploader.js.map