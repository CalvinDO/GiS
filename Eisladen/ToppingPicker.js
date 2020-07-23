"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class ToppingPicker {
        constructor() {
            this.wheelAmount = 40;
            this.wheelBorderRadius = 5;
            this.spokeAmount = 8;
            this.spokeWidth = 3;
            this.currentFrame = 0;
            this.loadToppingsFromJSON("json/toppings.json");
        }
        async loadToppingsFromJSON(_url) {
            let response = await fetch(_url);
            ToppingPicker.toppings = await response.json();
            this.jsonLoadingFinished = true;
            this.generateToppingBuckets(ToppingPicker.toppings);
        }
        generateToppingBuckets(_toppings) {
            ToppingPicker.toppingBuckets = [];
            for (let index = 0; index < _toppings.length; index++) {
                let currentToppingBucketPosition = new Vector2D(ToppingPicker.toppingBucketLeftOffset, ToppingPicker.beltPosition.y - ToppingPicker.toppingBucketBeltOffsetY);
                currentToppingBucketPosition.add(new Vector2D(index * (ToppingPicker.toppingBucketWidth + ToppingPicker.toppingBucketGap), 0));
                let toppingBucketDimensions = new Vector2D(ToppingPicker.toppingBucketWidth, ToppingPicker.toppingBucketHeight);
                let currentToppingBucket = new Eisladen.ToppingBucket(currentToppingBucketPosition, toppingBucketDimensions, _toppings[index]);
                ToppingPicker.toppingBuckets.push(currentToppingBucket);
            }
        }
        checkMouseClick(_x, _y) {
            for (let index = 0; index < ToppingPicker.toppingBuckets.length; index++) {
                ToppingPicker.toppingBuckets[index].checkMouseClick(_x, _y);
            }
        }
        calculate(_currentFrame) {
            this.beltCounterBarOffset = new Vector2D(0, Eisladen.canvas.height / 11);
            ToppingPicker.beltPosition = new Vector2D(0, Eisladen.canvas.height / Eisladen.ContainerSelector.goldenRatio - this.beltCounterBarOffset.y);
            ToppingPicker.beltDimensions = new Vector2D(Eisladen.canvas.width / 2 - Eisladen.canvas.width * 0.1, Eisladen.canvas.height / 28);
            ToppingPicker.toppingBucketWidth = Eisladen.canvas.width / 15;
            ToppingPicker.toppingBucketGap = ToppingPicker.toppingBucketWidth / 4;
            ToppingPicker.toppingBucketHeight = Eisladen.canvas.height / 6;
            ToppingPicker.toppingBucketLeftOffset = ToppingPicker.toppingBucketGap * 2;
            ToppingPicker.toppingBucketBeltOffsetY = Eisladen.canvas.height / 9 + ToppingPicker.toppingBucketHeight;
            for (let index = 0; index < ToppingPicker.toppingBuckets.length; index++) {
                ToppingPicker.toppingBuckets[index].calculate(_currentFrame);
            }
            this.currentFrame = _currentFrame;
        }
        draw() {
            this.drawBelt();
            for (let index = 0; index < ToppingPicker.toppingBuckets.length; index++) {
                ToppingPicker.toppingBuckets[index].draw();
            }
        }
        drawBelt() {
            this.drawChain(ToppingPicker.beltPosition, ToppingPicker.beltDimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = ToppingPicker.beltDimensions.y / 2;
            for (let index = 0; index < this.wheelAmount; index++) {
                let yPos = ToppingPicker.beltPosition.y + (ToppingPicker.beltDimensions.y / 2);
                let xPos = (ToppingPicker.beltPosition.x + ToppingPicker.beltDimensions.x) - (this.wheelRadius + ToppingPicker.beltPosition.x + index * (this.wheelRadius * 2 + this.wheelBorderRadius));
                let newPos = new Vector2D(xPos, yPos);
                let currentRotation = -this.currentFrame * ToppingPicker.beltSpeed;
                this.drawWheel(newPos, this.wheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
            }
        }
        drawWheel(_position, _radius, _borderRadius, _rotation, _innerColor, _outerColor) {
            Eisladen.crc2.lineWidth = _borderRadius;
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _innerColor;
            Eisladen.crc2.arc(_position.x, _position.y, _radius, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
            for (let index = 0; index < this.spokeAmount; index++) {
                let currentAngle = index / this.spokeAmount * 2 * Math.PI + _rotation;
                Eisladen.crc2.beginPath();
                Eisladen.crc2.strokeStyle = "rgb(132, 132, 132)";
                Eisladen.crc2.lineWidth = this.spokeWidth;
                Eisladen.crc2.moveTo(_position.x, _position.y);
                Eisladen.crc2.lineTo(_position.x + Math.sin(currentAngle) * _radius, _position.y + Math.cos(currentAngle) * _radius);
                Eisladen.crc2.stroke();
            }
            Eisladen.crc2.lineWidth = _borderRadius / 2;
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _outerColor;
            Eisladen.crc2.arc(_position.x, _position.y, _radius / 5, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
        }
        drawChain(_position, _dimensions, _innerColor, _outerColor) {
            Eisladen.crc2.lineWidth = 7;
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _innerColor;
            Eisladen.crc2.rect(_position.x, _position.y, _dimensions.x, _dimensions.y);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
        }
    }
    ToppingPicker.toppingBuckets = [];
    ToppingPicker.beltSpeed = 4;
    Eisladen.ToppingPicker = ToppingPicker;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=ToppingPicker.js.map