namespace Eisladen {
    import Vector2D = Vector.Vector2D;

    export class ToppingBucket {
        public position: Vector2D;
        public dimensions: Vector2D;
        public borderWidth: number;
        public topping: Topping;

        public currentFrame: number = 0;
        public timeAtLastDrop: number = 0;
        public timeSinceLastDrop: number = 0;

        public sortHeadingPosition: Vector2D;
        public sortPricePosition: Vector2D;

        public sortHeading: HTMLHeadingElement;
        public sortPrice: HTMLParagraphElement;

        public visualContent: Topping[];

        public gapWidth: number;
        public gapOpened: boolean;

        public airToppings: Topping[] = [];

        constructor(_position: Vector2D, _dimensions: Vector2D, _topping: Topping) {
            this.position = _position;
            this.dimensions = _dimensions;
            this.borderWidth = this.dimensions.x / 12;
            this.topping = _topping;

            this.generateTags();
            this.fillBucket();

            this.timeAtLastDrop = this.timeSinceLastDrop = timeSinceStart;
        }
        public fillBucket(): void {
            this.visualContent = [];

            let xFitAmount: number = (this.dimensions.x - this.borderWidth) / this.topping.size;
            let yFitAmount: number = (this.dimensions.y - this.borderWidth) / (this.topping.name == "Choclate Sprinkles" ? this.topping.size / 3 : this.topping.size);

            for (let xIndex: number = 0; xIndex < xFitAmount; xIndex++) {
                for (let yIndex: number = (yFitAmount / (ContainerSelector.goldenRatio)) / 2; yIndex < yFitAmount; yIndex++) {
                    let x: number = xIndex * this.topping.size + this.position.x + this.borderWidth;
                    let yOffset: number = this.topping.name == "Choclate Sprinkles" ? yIndex * this.topping.size / 3 : yIndex * this.topping.size;
                    let y: number = yOffset + this.position.y + this.borderWidth / 2;
                    let currentPosition: Vector2D = new Vector2D(x, y);
                    let currentTopping: Topping = Topping.getPhysicalCloneFrom(this.topping, currentPosition, new Vector2D(0, 0));
                    this.visualContent.push(currentTopping);
                }
            }
        }
        public draw(): void {
            Eisladen.crc2.lineWidth = this.borderWidth;
            Eisladen.crc2.strokeStyle = "rgb(50, 60, 60)";

            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x, this.position.y - this.borderWidth / 2);
            Eisladen.crc2.lineTo(this.position.x, this.position.y + this.dimensions.y + this.borderWidth / 2);
            Eisladen.crc2.stroke();

            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x, this.position.y + this.dimensions.y);
            Eisladen.crc2.lineTo(this.position.x + this.dimensions.x + this.borderWidth / 2 - this.dimensions.x / 2 - this.gapWidth, this.position.y + this.dimensions.y);
            Eisladen.crc2.stroke();

            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x + this.dimensions.x / 2 + this.gapWidth, this.position.y + this.dimensions.y);
            Eisladen.crc2.lineTo(this.position.x + this.dimensions.x + this.borderWidth / 2, this.position.y + this.dimensions.y);
            Eisladen.crc2.stroke();

            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x + this.dimensions.x, this.position.y + this.dimensions.y);
            Eisladen.crc2.lineTo(this.position.x + this.dimensions.x, this.position.y - this.borderWidth / 2);
            Eisladen.crc2.stroke();

            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x + this.dimensions.x + this.borderWidth / 2, this.position.y - this.borderWidth / 2);
            Eisladen.crc2.lineTo(this.position.x - this.borderWidth / 2, this.position.y - this.borderWidth / 2);
            Eisladen.crc2.stroke();

            this.drawVisualContent();

            for (let index: number = 0; index < this.airToppings.length; index++) {
                if (!this.airToppings[index].stick) {
                    this.airToppings[index].draw();
                }
            }
        }
        
        public checkMouseClick(_x: number, _y: number): void {
            let hit: boolean = true;
            if (_x < this.position.x || _x > this.position.x + this.dimensions.x) {
                hit = false;
            }
            if (_y < this.position.y || _y > this.position.y + this.dimensions.y) {
                hit = false;
            }
            if (hit) {
                this.gapOpened = this.gapOpened ? false : true;
            }
        }

        public calculate(_currentFrame: number): void {
            this.currentFrame = _currentFrame;

            if (!this.gapOpened) {
                this.gapWidth = 0;
            } else {
                this.gapWidth = this.dimensions.x / 6;
            }
            for (let index: number = 0; index < this.airToppings.length; index++) {
                this.airToppings[index].calculate();
            }
            if (this.gapOpened) {
                this.timeSinceLastDrop = timeSinceStart - this.timeAtLastDrop;

                if (this.timeSinceLastDrop > 250) {
                    this.timeSinceLastDrop = 0;
                    this.timeAtLastDrop = timeSinceStart;
                    this.dropContent();
                }
            }
        }
        public dropContent(): void {
            let position: Vector2D = new Vector2D(this.position.x + this.dimensions.x / 2, this.position.y + this.dimensions.y);
            let newTopping: Topping = Topping.getPhysicalCloneFrom(this.topping, position, new Vector2D(0, 0));
            this.airToppings.push(newTopping);
            totalPriceWithoutContainer += this.topping.price;
            Eisladen.updateLocalStorage();
        }

        public drawVisualContent(): void {
            for (let index: number = 0; index < this.visualContent.length; index++) {
                this.visualContent[index].draw();
            }
        }
        public generateTags(): void {
            let extraOffset: Vector2D = new Vector2D(-60, -this.dimensions.y);
            this.sortHeadingPosition = new Vector2D(this.position.x + this.dimensions.x / 2 + extraOffset.x, this.position.y + this.dimensions.y / 2 + extraOffset.y * 1.2);
            this.sortPricePosition = new Vector2D(this.position.x + this.dimensions.x / 2 + extraOffset.x, this.position.y + this.dimensions.y / 2 + extraOffset.y);
            this.sortHeading = document.createElement("h2");
            this.sortHeading.innerHTML = this.topping.name;
            this.sortHeading.setAttribute("class", "toppingSortPriceDisplay");
            this.sortHeading.setAttribute("style", "width: " + this.dimensions.x + "px");
            this.sortHeading.setAttribute("style", "left: " + (this.sortHeadingPosition.x) + "px; top: " + (this.sortHeadingPosition.y) + "px");
            document.body.append(this.sortHeading);
            this.sortPrice = document.createElement("p");
            this.sortPrice.innerHTML = this.topping.price + " €";
            this.sortPrice.setAttribute("class", "toppingSortPriceDisplay");
            this.sortPrice.setAttribute("style", "width: " + this.dimensions.x + "px");

            this.sortPrice.setAttribute("style", "left: " + (this.sortPricePosition.x) + "px; top: " + (this.sortPricePosition.y) + "px");
            this.updateTagColors();
            document.body.append(this.sortPrice);
        }
        public moveTags(_translation: Vector2D): void {
            this.sortHeadingPosition.add(_translation);
            this.sortPricePosition.add(_translation);

            this.sortHeading.setAttribute("style", "left: " + (this.sortHeadingPosition.x) + "px; top: " + (this.sortHeadingPosition.y) + "px");
            this.sortPrice.setAttribute("style", "left: " + (this.sortPricePosition.x) + "px; top: " + (this.sortPricePosition.y) + "px");
            this.updateTagColors();
        }
        public updateTagColors(): void {
            this.sortHeading.style.backgroundColor = this.topping.color;
            this.sortPrice.style.backgroundColor = this.topping.color;

        }
    }
}