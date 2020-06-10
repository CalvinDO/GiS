"use strict";
var ShopJson;
(function (ShopJson) {
    class Article {
        constructor(_name, _description, _image, _price) {
            this.name = _name;
            this.id = _name;
            this.description = _description;
            this.image = _image;
            this.price = _price;
            this.wagen = "wagen.svg";
        }
        static createFromJSON(_json) {
            return new Article(_json.name, _json.description, _json.image, _json.price);
        }
        buildDiv() {
            let outputDiv = document.createElement("div");
            let newName = document.createElement("h3");
            let newDescription = document.createElement("p");
            let newImage = document.createElement("img");
            let newPrice = document.createElement("p");
            let newWagenLink = document.createElement("a");
            let newWagenImage = document.createElement("img");
            newName.innerHTML = this.name;
            newDescription.innerHTML = this.description;
            newImage.setAttribute("src", this.image);
            newImage.setAttribute("alt", this.name);
            newPrice.innerHTML = this.price + "€";
            newWagenLink.setAttribute("href", "#Einkaufswagen");
            newWagenImage.setAttribute("src", this.wagen);
            newWagenImage.setAttribute("alt", "Einkaufswagen");
            newWagenLink.append(newWagenImage);
            newWagenLink.addEventListener("click", this.handleClickWagen.bind(this));
            outputDiv.append(newName);
            outputDiv.append(newDescription);
            outputDiv.append(newImage);
            outputDiv.append(newPrice);
            outputDiv.append(newWagenLink);
            outputDiv.setAttribute("id", this.id);
            return outputDiv;
        }
        handleClickWagen(_click) {
            ShopJson.articleCount++;
            ShopJson.priceCount += this.price;
            this.counterLi = document.querySelector(".counter");
            this.counterLi.innerHTML = ShopJson.articleCount <= 0 ? "" : ("" + ShopJson.articleCount);
            this.counterLi.setAttribute("style", ShopJson.articleCount <= 0 ? "display:none !important" : "display:inline-block !important");
            console.log(ShopJson.priceCount);
            this.pushLocalStorage(this);
        }
        pushLocalStorage(_article) {
            let articleName = _article.name;
            let contentString = JSON.stringify(_article);
            localStorage.setItem(articleName, contentString);
        }
    }
    ShopJson.Article = Article;
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Article.js.map