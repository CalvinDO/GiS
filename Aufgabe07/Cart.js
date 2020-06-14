"use strict";
var ShopJson;
(function (ShopJson) {
    window.addEventListener("load", init);
    let productsWrapper;
    let container;
    let articleDiv;
    let counterLi;
    let totalPrice;
    let totalAmount;
    let removeAllButton;
    let generateRandomButton;
    let colorAngle = 0;
    let colorOffset = 45;
    let strobeSpeed = 0.5;
    let allArticles;
    let randomAmount = 5;
    function init(_event) {
        productsWrapper = document.querySelector(".products");
        container = document.createElement("div");
        container.setAttribute("class", "product-category");
        productsWrapper.append(container);
        counterLi = document.querySelector(".counterCart");
        generateRandomButton = document.querySelector("button");
        loadRemoveAllListener();
        generateRandomButton.addEventListener("click", handlePickRandom);
        loadForRandomPicker("Articles.json");
        updateArticles();
        animate();
    }
    async function loadForRandomPicker(_url) {
        let response = await fetch(_url);
        let categorysJSON = await response.json();
        allArticles = [];
        for (let index = 0; index < categorysJSON.length; index++) {
            allArticles = allArticles.concat(categorysJSON[index]);
        }
    }
    function updateArticles() {
        container.innerHTML = "";
        totalPrice = 0;
        totalAmount = 0;
        for (let index = 0; index < localStorage.length; index++) {
            let key = localStorage.key(index);
            if (key != "cartAmount") {
                let articleJson = localStorage.getItem(key);
                let parsed = JSON.parse(articleJson);
                let article = ShopJson.Article.createFromJSON(parsed);
                totalAmount += article.amount;
                totalPrice += article.price * article.amount;
                articleDiv = article.buildDiv(false);
                container.append(articleDiv);
            }
        }
        localStorage.setItem("cartAmount", totalAmount + "");
        updateCounter();
    }
    ShopJson.updateArticles = updateArticles;
    function loadRemoveAllListener() {
        removeAllButton = document.querySelector("#removeAll");
        removeAllButton.addEventListener("click", handleRemoveAll);
    }
    function updateCounter() {
        counterLi.setAttribute("style", totalPrice <= 0 ? "display:none !important" : "display:inline-block !important");
        counterLi.innerHTML = totalPrice <= 0 ? "" : totalPrice + "€";
        if (totalAmount <= 0) {
            container.innerHTML = "Der Einkaufswagen ist leer";
            container.style.font = "22px Arial, sans-serif";
        }
        else {
            container.style.removeProperty("font");
        }
    }
    function handleRemoveAll(_event) {
        localStorage.clear();
        updateArticles();
    }
    function animateGradients() {
        let offsetIndex = 0;
        let currentDiv;
        let currentAmount = 0;
        let speed = 0;
        for (let index = 0; index < localStorage.length; index++) {
            let key = localStorage.key(index);
            if (key != "cartAmount") {
                currentDiv = container.children[index - offsetIndex];
                let articleJson = localStorage.getItem(key);
                let parsed = JSON.parse(articleJson);
                currentAmount = parsed.amount;
                speed = currentAmount * strobeSpeed;
                let color1 = "HSLA(" + colorAngle * speed + ",100%,50%, 1)";
                let color2 = "HSLA(" + (colorAngle * speed + colorOffset) + ",100%,50%, 1)";
                currentDiv.style.backgroundImage = "linear-gradient(" + color1 + "," + color2 + ")";
            }
            else {
                offsetIndex++;
            }
        }
    }
    function animateRandomButton() {
        let color1 = "HSLA(" + colorAngle * strobeSpeed * 10 + ",100%,50%, 1)";
        let color2 = "HSLA(" + (colorAngle * strobeSpeed * 10 + colorOffset) + ",100%,50%, 1)";
        generateRandomButton.style.backgroundImage = "linear-gradient(" + color1 + "," + color2 + ")";
    }
    function handlePickRandom(_event) {
        let random;
        let randomInt = 0;
        for (let index = 0; index < randomAmount; index++) {
            random = Math.random() * allArticles.length;
            randomInt = Math.floor(random);
            let pickedArticle = allArticles[randomInt];
            let establishArticle = JSON.parse(localStorage.getItem(pickedArticle.name));
            if (establishArticle == null) {
                pickedArticle.amount = 1;
            }
            else {
                pickedArticle.amount = establishArticle.amount + 1;
            }
            localStorage.setItem(pickedArticle.name, JSON.stringify(pickedArticle));
        }
        updateArticles();
    }
    function animate() {
        colorAngle++;
        animateGradients();
        animateRandomButton();
        requestAnimationFrame(animate);
    }
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Cart.js.map