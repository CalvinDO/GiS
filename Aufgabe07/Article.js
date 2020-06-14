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
                return new Article(_json.name, _json.description, _json.image, _json.price, _json.amount);
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
                outputDiv.append(_inCart ? this.generateInCart() : this.generateAmountControl());
                outputDiv.setAttribute("id", this.id);
                return outputDiv;
            }
            handleClickWagen(_click) {
                ShopJson.articleCount++;
                this.amount += 1;
                console.log(ShopJson.articleCount);
                localStorage.setItem("cartAmount", "" + ShopJson.articleCount);
                ShopJson.priceCount += this.price;
                ShopJson.updateArticleCount();
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
            generateAmountControl() {
                let divOutput = document.createElement("div");
                let newDeleteLink = document.createElement("a");
                let newAddLink = document.createElement("a");
                let newSubtractLink = document.createElement("a");
                let newDeleteImage = document.createElement("img");
                let newAddImage = document.createElement("img");
                let newSubtractImage = document.createElement("img");
                newDeleteLink.setAttribute("href", "#/");
                newDeleteImage.setAttribute("src", "delete.png");
                newDeleteImage.setAttribute("alt", "delete");
                newDeleteLink.append(newDeleteImage);
                newAddLink.setAttribute("href", "#/");
                newAddImage.setAttribute("src", "add.png");
                newAddImage.setAttribute("alt", "add");
                newAddLink.append(newAddImage);
                newSubtractLink.setAttribute("href", "#/");
                newSubtractImage.setAttribute("src", "subtract.png");
                newSubtractImage.setAttribute("alt", "subtract");
                newSubtractLink.append(newSubtractImage);
                let display = document.createElement("input");
                display.placeholder = this.amount + "";
                display.innerHTML = this.amount + "";
                display.addEventListener("change", this.textChange.bind(this));
                newDeleteLink.addEventListener("click", this.handleClickRemove.bind(this));
                newAddLink.addEventListener("click", this.handleAmountInteraction.bind(this));
                newSubtractLink.addEventListener("click", this.handleAmountInteraction.bind(this));
                divOutput.append(newDeleteLink);
                divOutput.append(newSubtractLink);
                divOutput.append(display);
                divOutput.append(newAddLink);
                return divOutput;
            }
            textChange(_event) {
                let input = _event.target;
                this.amount = +input.value;
                localStorage.setItem(this.name, JSON.stringify(this));
                ShopJson.updateArticles();
            }
            handleAmountInteraction(_event) {
                let target = _event.target;
                switch (target.getAttribute("alt")) {
                    case "add":
                        this.amount++;
                        break;
                    case "subtract":
                        this.amount -= 1;
                        break;
                }
                if (this.amount > 0) {
                    localStorage.setItem(this.name, JSON.stringify(this));
                }
                else {
                    localStorage.removeItem(this.name);
                }
                ShopJson.updateArticles();
            }
        }
        Article.wagen = "wagen.svg";
        return Article;
    })();
    ShopJson.Article = Article;
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=Article.js.map