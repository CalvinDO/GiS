"use strict";
var ShopJson;
(function (ShopJson) {
    let Article = /** @class */ (() => {
        class Article {
            constructor(_name, _description, _image, _price, _amount) {
                this.name = _name;
                this.id = _name;
                this.description = _description;
                this.image = _image;
                this.price = _price;
                this.amount = _amount;
            }
            static createFromJSON(_json) {
                return new Article(_json.name, _json.description, _json.image, _json.price, 1);
            }
            buildDiv(_inCart) {
                let outputDiv = document.createElement("div");
                let newName = document.createElement("h3");
                let newDescription = document.createElement("p");
                let newImage = document.createElement("img");
                let newPrice = document.createElement("p");
                newName.innerHTML = this.name;
                newDescription.innerHTML = this.description;
                newImage.setAttribute("src", this.image);
                newImage.setAttribute("alt", this.name);
                newPrice.innerHTML = this.price + "€";
                outputDiv.append(newName);
                outputDiv.append(newDescription);
                outputDiv.append(newImage);
                outputDiv.append(newPrice);
                outputDiv.append(_inCart ? this.generateInCart() : this.generateRemoveFromCart());
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
                this.amount += 1;
                this.pushLocalStorage(this);
            }
            handleClickRemove(_click) {
                localStorage.removeItem(this.name);
                ShopJson.updateArticles();
            }
            pushLocalStorage(_article) {
                let articleName = _article.name;
                let contentString = JSON.stringify(_article);
                localStorage.setItem(articleName, contentString);
            }
            generateInCart() {
                let newWagenLink = document.createElement("a");
                let newWagenImage = document.createElement("img");
                newWagenLink.setAttribute("href", "#/");
                newWagenImage.setAttribute("src", Article.wagen);
                newWagenImage.setAttribute("alt", "Einkaufswagen");
                newWagenLink.append(newWagenImage);
                newWagenLink.addEventListener("click", this.handleClickWagen.bind(this));
                return newWagenLink;
            }
            generateRemoveFromCart() {
                let divOutput = document.createElement("div");
                let newDeleteLink = document.createElement("a");
                let newAddLink = document.createElement("a");
                let newSubtractLink = document.createElement("a");
                let newDeleteImage = document.createElement("img");
                let newAddImage = document.createElement("img");
                let newSubtractImage = document.createElement("img");
                newDeleteLink.setAttribute("href", "#/");
                newDeleteImage.setAttribute("src", "delete.png");
                newDeleteImage.setAttribute("alt", "Einkaufswagen");
                newDeleteLink.append(newDeleteImage);
                newAddLink.setAttribute("href", "#/");
                newAddImage.setAttribute("src", "add.png");
                newAddImage.setAttribute("alt", "Einkaufswagen");
                newAddLink.append(newAddImage);
                newSubtractLink.setAttribute("href", "#/");
                newSubtractImage.setAttribute("src", "subtract.png");
                newSubtractImage.setAttribute("alt", "Einkaufswagen");
                newSubtractLink.append(newSubtractImage);
                let display = document.createElement("span");
                display.innerHTML = this.amount + "";
                newDeleteLink.addEventListener("click", this.handleClickRemove.bind(this));
                divOutput.append(newDeleteLink);
                divOutput.append(newSubtractLink);
                divOutput.append(display);
                divOutput.append(newAddLink);
                console.log(divOutput);
                return divOutput;
            }
        }
        Article.wagen = "wagen.svg";
        return Article;
    })();
    ShopJson.Article = Article;
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Article.js.map