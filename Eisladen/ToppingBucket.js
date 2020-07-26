"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = IceVector.Vector2D;
    class ToppingBucket {
        constructor(_position, _dimensions, _topping) {
            this.currentFrame = 0;
            this.timeAtLastDrop = 0;
            this.timeSinceLastDrop = 0;
            this.airToppings = [];
            this.position = _position;
            this.dimensions = _dimensions;
            this.borderWidth = this.dimensions.x / 12;
            this.topping = _topping;
            this.generateTags();
            this.fillBucket();
            this.timeAtLastDrop = this.timeSinceLastDrop = Eisladen.timeSinceStart;
        }
        fillBucket() {
            this.visualContent = [];
            let xFitAmount = (this.dimensions.x - this.borderWidth) / this.topping.size;
            let yFitAmount = (this.dimensions.y - this.borderWidth) / (this.topping.name == "Choclate Sprinkles" ? this.topping.size / 3 : this.topping.size);
            for (let xIndex = 0; xIndex < xFitAmount; xIndex++) {
                for (let yIndex = (yFitAmount / (Eisladen.ContainerSelector.goldenRatio)) / 2; yIndex < yFitAmount; yIndex++) {
                    let x = xIndex * this.topping.size + this.position.x + this.borderWidth;
                    let yOffset = this.topping.name == "Choclate Sprinkles" ? yIndex * this.topping.size / 3 : yIndex * this.topping.size;
                    let y = yOffset + this.position.y + this.borderWidth / 2;
                    let currentPosition = new Vector2D(x, y);
                    let currentTopping = Eisladen.Topping.getPhysicalCloneFrom(this.topping, currentPosition, new Vector2D(0, 0));
                    this.visualContent.push(currentTopping);
                }
            }
        }
        draw() {
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
            for (let index = 0; index < this.airToppings.length; index++) {
                if (!this.airToppings[index].stick) {
                    this.airToppings[index].draw();
                }
            }
        }
        checkMouseClick(_x, _y) {
            let hit = true;
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
        calculate(_currentFrame) {
            this.currentFrame = _currentFrame;
            if (!this.gapOpened) {
                this.gapWidth = 0;
            }
            else {
                this.gapWidth = this.dimensions.x / 6;
            }
            for (let index = 0; index < this.airToppings.length; index++) {
                this.airToppings[index].calculate();
            }
            if (this.gapOpened) {
                this.timeSinceLastDrop = Eisladen.timeSinceStart - this.timeAtLastDrop;
                if (this.timeSinceLastDrop > 250) {
                    this.timeSinceLastDrop = 0;
                    this.timeAtLastDrop = Eisladen.timeSinceStart;
                    this.dropContent();
                }
            }
        }
        dropContent() {
            let position = new Vector2D(this.position.x + this.dimensions.x / 2, this.position.y + this.dimensions.y);
            let newTopping = Eisladen.Topping.getPhysicalCloneFrom(this.topping, position, new Vector2D(0, 0));
            this.airToppings.push(newTopping);
            Eisladen.totalPriceWithoutContainer += this.topping.price;
            Eisladen.updateLocalStorage();
        }
        drawVisualContent() {
            for (let index = 0; index < this.visualContent.length; index++) {
                this.visualContent[index].draw();
            }
        }
        generateTags() {
            let extraOffset = new Vector2D(-this.dimensions.x / 2, -this.dimensions.y);
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
            this.sortPrice.style.fontSize = this.dimensions.x / 7 + "px";
            this.updateTagColors();
            console.log(this.sortHeadingPosition);
            document.body.append(this.sortPrice);
        }
        moveTags(_translation) {
            this.sortHeadingPosition.add(_translation);
            this.sortPricePosition.add(_translation);
            this.sortHeading.setAttribute("style", "left: " + (this.sortHeadingPosition.x) + "px; top: " + (this.sortHeadingPosition.y) + "px");
            this.sortPrice.setAttribute("style", "left: " + (this.sortPricePosition.x) + "px; top: " + (this.sortPricePosition.y) + "px");
            this.updateTagColors();
        }
        updateTagColors() {
            this.sortHeading.style.backgroundColor = this.topping.color;
            this.sortPrice.style.backgroundColor = this.topping.color;
        }
    }
    Eisladen.ToppingBucket = ToppingBucket;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=ToppingBucket.js.map