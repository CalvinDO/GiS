namespace Shop {
    export class Article {
        
        public name: string;
        public description: string;
        public image: string;
        public price: number;
        public wagen: string;

        public constructor(_name: string, _description: string, _image: string, _price: number) {
            this.name = _name;
            this.description = _description;
            this.image = _image;
            this.price = _price;
            this.wagen = "wagen.svg";
        }

        public buildDiv(): HTMLDivElement {
            let outputDiv: HTMLDivElement = document.createElement("div");

            let newName: HTMLHeadingElement = document.createElement("h3");
            let newDescription: HTMLParagraphElement = document.createElement("p");
            let newImage: HTMLImageElement = document.createElement("img");
            let newPrice: HTMLParagraphElement = document.createElement("p");
            let newWagenLink: HTMLAnchorElement = document.createElement("a");
            let newWagenImage: HTMLImageElement = document.createElement("img");

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
}