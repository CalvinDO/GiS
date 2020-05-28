namespace shoploader {
    function main(): void {
        for (let i: number = 0; i < 50; i++) {
            let newName: HTMLHeadingElement = document.createElement("h3");
            newName.innerHTML = "Saison-Zylinder";

            let newDescription: HTMLParagraphElement = document.createElement("p");
            newDescription.innerHTML = "Gerade zu dieser Jahreszeit sticht der Saison-Zylinder mit seiner Form heraus";

            let newImage: HTMLImageElement = document.createElement("img");
            newImage.setAttribute("src", "Saison.jpg");
            newImage.setAttribute("alt", "Saison");

            let newPrice: HTMLParagraphElement = document.createElement("p");
            newPrice.innerHTML = "20€";

            let newWagenLink: HTMLAnchorElement = document.createElement("a");
            newWagenLink.setAttribute("href", "#Einkaufswagen");

            let newWagenImage: HTMLImageElement = document.createElement("img");
            newImage.setAttribute("src", "wagen.svg");
            newImage.setAttribute("alt", "Einkaufswagen");

            newWagenLink.append(newWagenImage);

            let newProduct: HTMLDivElement = document.createElement("div");
            newProduct.append(newName);
            newProduct.append(newDescription);
            newProduct.append(newImage);
            newProduct.append(newPrice);
            newProduct.append(newWagenLink);

            let productsDiv: HTMLDivElement = <HTMLDivElement>document.querySelector("#Holzscheite + .product-category");
            productsDiv.append(newProduct);
        }
    }
    main();
}