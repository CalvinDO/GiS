"use strict";
var Shop;
(function (Shop) {
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
            outputDiv.append(newName);
            outputDiv.append(newDescription);
            outputDiv.append(newImage);
            outputDiv.append(newPrice);
            outputDiv.append(newWagenLink);
            return outputDiv;
        }
    }
    Shop.Article = Article;
})(Shop || (Shop = {}));
//# sourceMappingURL=Article.js.map