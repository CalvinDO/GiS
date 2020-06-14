namespace ShopJson {
    export class Article {
        private static wagen: string = "wagen.svg";
        public name: string;
        public description: string;
        public image: string;
        public price: number;
        public id: string;
        public amount: number;

        public constructor(_name: string, _description: string, _image: string, _price: number, _amount: number) {
            this.name = _name;
            this.id = _name;
            this.description = _description;
            this.image = _image;
            this.price = _price;
            this.amount = _amount;
        }

        public static createFromJSON(_json: Article): Article {
            return new Article(_json.name, _json.description, _json.image, _json.price, _json.amount);
        }

        public buildDiv(_inCart: boolean): HTMLDivElement {
            let outputDiv: HTMLDivElement = document.createElement("div");

            let newName: HTMLHeadingElement = document.createElement("h3");
            let newDescription: HTMLParagraphElement = document.createElement("p");
            let newImage: HTMLImageElement = document.createElement("img");
            let newPrice: HTMLParagraphElement = document.createElement("p");

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

        public handleClickWagen(_click: MouseEvent): void {
            articleCount++;
            this.amount += 1;
            console.log(ShopJson.articleCount);
            localStorage.setItem("cartAmount", "" + articleCount);

            priceCount += this.price;
            updateArticleCount();

            this.pushLocalStorage(this);
        }

        public handleClickRemove(_click: MouseEvent): void {
            localStorage.removeItem(this.name);
            updateArticles();
        }

        private pushLocalStorage(_article: Article): void {
            let articleName: string = _article.name;
            let contentString: string = JSON.stringify(_article);
            localStorage.setItem(articleName, contentString);
        }

        private generateInCart(): HTMLAnchorElement {
            let newWagenLink: HTMLAnchorElement = document.createElement("a");
            let newWagenImage: HTMLImageElement = document.createElement("img");

            newWagenLink.setAttribute("href", "#/");
            newWagenImage.setAttribute("src", Article.wagen);
            newWagenImage.setAttribute("alt", "Einkaufswagen");
            newWagenLink.append(newWagenImage);

            newWagenLink.addEventListener("click", this.handleClickWagen.bind(this));
            return newWagenLink;
        }

        private generateAmountControl(): HTMLDivElement {
            let divOutput: HTMLDivElement = document.createElement("div");

            let newDeleteLink: HTMLAnchorElement = document.createElement("a");
            let newAddLink: HTMLAnchorElement = document.createElement("a");
            let newSubtractLink: HTMLAnchorElement = document.createElement("a");

            let newDeleteImage: HTMLImageElement = document.createElement("img");
            let newAddImage: HTMLImageElement = document.createElement("img");
            let newSubtractImage: HTMLImageElement = document.createElement("img");

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

            let display: HTMLInputElement = document.createElement("input");
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
        private textChange(_event: Event): void {
            let input: HTMLInputElement = <HTMLInputElement>_event.target;
            this.amount = +input.value;
            localStorage.setItem(this.name, JSON.stringify(this));
            updateArticles();
        }

        private handleAmountInteraction(_event: MouseEvent): void {
            let target: HTMLAnchorElement = <HTMLAnchorElement>_event.target;
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
            } else {
                localStorage.removeItem(this.name);
            }
            updateArticles();
        }
    }
}