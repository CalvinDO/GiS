"use strict";
var ShopInteractive;
(function (ShopInteractive) {
    class Article {
        constructor(_name, _description, _image, _price) {
            this.name = _name;
            this.description = _description;
            this.image = _image;
            this.price = _price;
            this.wagen = "wagen.svg";
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
            return outputDiv;
        }
        handleClickWagen(_click) {
            ShopInteractive.articleCount++;
            ShopInteractive.priceCount += this.price;
            this.counterLi = document.querySelector(".counter");
            this.counterLi.innerHTML = ShopInteractive.articleCount <= 0 ? "" : ("" + ShopInteractive.articleCount);
            this.counterLi.setAttribute("style", ShopInteractive.articleCount <= 0 ? "display:none !important" : "display:inline-block !important");
            console.log(ShopInteractive.priceCount);
        }
    }
    ShopInteractive.Article = Article;
})(ShopInteractive || (ShopInteractive = {}));
//# sourceMappingURL=Article.js.map