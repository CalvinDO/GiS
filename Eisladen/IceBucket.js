"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class IceBucket {
        constructor(_position, _dimensions, _iceSort) {
            this.maxTimeTillCutOutToVanish = 4000;
            this.position = _position;
            this.dimensions = _dimensions;
            this.borderWidth = this.dimensions.x / 12;
            this.iceSort = _iceSort;
            this.generateTags();
        }
        generateTags() {
            let extraOffset = new Vector2D(-20, 34);
            this.sortHeadingPosition = new Vector2D(this.position.x + this.dimensions.x / 2 + extraOffset.x, this.position.y + this.dimensions.y / 2 + extraOffset.y);
            this.sortPricePosition = new Vector2D(this.position.x + this.dimensions.x / 2 + extraOffset.x, this.position.y + this.dimensions.y / 2 + extraOffset.y * 2);
            this.sortHeading = document.createElement("h2");
            this.sortHeading.innerHTML = this.iceSort.name;
            this.sortHeading.setAttribute("class", "iceSortPriceDisplay");
            this.sortHeading.setAttribute("style", "width: " + this.dimensions.x + "px");
            this.sortHeading.setAttribute("style", "left: " + (this.sortHeadingPosition.x) + "px; top: " + (this.sortHeadingPosition.y) + "px;");
            document.body.append(this.sortHeading);
            this.sortPrice = document.createElement("p");
            this.sortPrice.innerHTML = this.iceSort.price + " €";
            this.sortPrice.setAttribute("class", "iceSortPriceDisplay");
            this.sortPrice.setAttribute("style", "width: " + this.dimensions.x + "px");
            this.sortPrice.setAttribute("style", "left: " + (this.sortPricePosition.x) + "px; top: " + (this.sortPricePosition.y) + "px;");
            this.updateTagColors();
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
            this.sortHeading.style.backgroundColor = this.iceSort.color;
            this.sortPrice.style.backgroundColor = this.iceSort.color;
        }
        draw() {
            if (this.position.x < Eisladen.canvas.width / 2 || this.position.x + this.dimensions.x > Eisladen.canvas.width) {
                this.sortHeading.style.opacity = "0.1";
                this.sortPrice.style.opacity = "0.1";
                Eisladen.crc2.globalAlpha = 0.1;
            }
            Eisladen.crc2.beginPath();
            Eisladen.crc2.fillStyle = this.iceSort.color;
            Eisladen.crc2.rect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
            Eisladen.crc2.fill();
            Eisladen.crc2.lineWidth = this.borderWidth;
            Eisladen.crc2.strokeStyle = "rgb(50, 60, 60)";
            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x, this.position.y - this.borderWidth / 2);
            Eisladen.crc2.lineTo(this.position.x, this.position.y + this.dimensions.y + this.borderWidth / 2);
            Eisladen.crc2.stroke();
            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x, this.position.y + this.dimensions.y);
            Eisladen.crc2.lineTo(this.position.x + this.dimensions.x + this.borderWidth / 2, this.position.y + this.dimensions.y);
            Eisladen.crc2.stroke();
            Eisladen.crc2.beginPath();
            Eisladen.crc2.moveTo(this.position.x + this.dimensions.x, this.position.y + this.dimensions.y);
            Eisladen.crc2.lineTo(this.position.x + this.dimensions.x, this.position.y - this.borderWidth / 2);
            Eisladen.crc2.stroke();
            Eisladen.crc2.globalAlpha = 1;
        }
        setCutOut(_position, _radius, _frame) {
            this.timeAtCutOut = Eisladen.timeSinceStart;
            this.isCutOut = true;
            this.cutOutBallPos = _position;
            this.cutOutBallRadius = _radius;
        }
        drawCutOut(_currentFrame) {
            let diffTime = (Eisladen.timeSinceStart - this.timeAtCutOut);
            if (diffTime >= this.maxTimeTillCutOutToVanish) {
                Eisladen.crc2.globalAlpha = 0;
            }
            else {
                Eisladen.crc2.globalAlpha = 1 - (diffTime) / this.maxTimeTillCutOutToVanish;
            }
            if (this.isCutOut) {
                Eisladen.crc2.beginPath();
                Eisladen.crc2.fillStyle = Eisladen.backgroundColor;
                Eisladen.crc2.arc(this.cutOutBallPos.x, this.cutOutBallPos.y, this.cutOutBallRadius, 0 * Math.PI, 2 * Math.PI, false);
                Eisladen.crc2.fill();
            }
            Eisladen.crc2.globalAlpha = 1;
        }
        isShovelInBucket(_position, _width) {
            if (this.position.x < Eisladen.canvas.width / 2 || this.position.x + this.dimensions.x > Eisladen.canvas.width) {
                return false;
            }
            if (_position.x - _width < this.position.x || _position.x + _width > this.position.x + this.dimensions.x) {
                return false;
            }
            if (_position.y - _width < this.position.y || _position.y + _width > this.position.y + this.dimensions.y) {
                return false;
            }
            return true;
        }
    }
    Eisladen.IceBucket = IceBucket;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=IceBucket.js.map