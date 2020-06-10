namespace ShopJson {
    export class Article {

        public name: string;
        public description: string;
        public image: string;
        public price: number;
        public wagen: string;
        public id: string;
        public counterLi: HTMLLIElement;

        public constructor(_name: string, _description: string, _image: string, _price: number) {
            this.name = _name;
            this.id = _name;
            this.description = _description;
            this.image = _image;
            this.price = _price;
            this.wagen = "wagen.svg";
        }

        public static createFromJSON(_json: Article): Article {
            return new Article(_json.name, _json.description, _json.image, _json.price);
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

            newWagenLink.addEventListener("click", this.handleClickWagen.bind(this));

            outputDiv.append(newName);
            outputDiv.append(newDescription);
            outputDiv.append(newImage);
            outputDiv.append(newPrice);
            outputDiv.append(newWagenLink);

            outputDiv.setAttribute("id", this.id);
            return outputDiv;
        }

        public handleClickWagen(_click: MouseEvent): void {
            articleCount++;
            priceCount += this.price;

            this.counterLi = <HTMLLIElement>document.querySelector(".counter");
            this.counterLi.innerHTML = articleCount <= 0 ? "" : ("" + articleCount);
            this.counterLi.setAttribute("style", articleCount <= 0 ? "display:none !important" : "display:inline-block !important");

            console.log(priceCount);

            this.pushLocalStorage(this);
        }

        private pushLocalStorage(_article: Article): void {
            let articleName: string = _article.name;
            let contentString: string = JSON.stringify(_article);
            localStorage.setItem(articleName, contentString);
        }
    }
}