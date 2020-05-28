"use strict";
var shoploader;
(function (shoploader) {
    function main() {
        for (let i = 0; i < 5000; i++) {
            let newName = document.createElement("h3");
            newName.innerHTML = "Saison-Zylinder";
            let newDescription = document.createElement("p");
            newDescription.innerHTML = "Gerade zu dieser Jahreszeit sticht der Saison-Zylinder mit seiner Form heraus";
            let newImage = document.createElement("img");
            newImage.setAttribute("src", "Saison.jpg");
            newImage.setAttribute("alt", "Saison");
            let newPrice = document.createElement("p");
            newPrice.innerHTML = "20€";
            let newWagenLink = document.createElement("a");
            newWagenLink.setAttribute("href", "#Einkaufswagen");
            let newWagenImage = document.createElement("img");
            newWagenImage.setAttribute("src", "wagen.svg");
            newWagenImage.setAttribute("alt", "Einkaufswagen");
            newWagenLink.append(newWagenImage);
            let newProduct = document.createElement("div");
            newProduct.append(newName);
            newProduct.append(newDescription);
            newProduct.append(newImage);
            newProduct.append(newPrice);
            newProduct.append(newWagenLink);
            let productsDiv = document.querySelector("#Holzscheite + .product-category");
            productsDiv.append(newProduct);
        }
    }
    main();
})(shoploader || (shoploader = {}));
//# sourceMappingURL=shoploader.js.map