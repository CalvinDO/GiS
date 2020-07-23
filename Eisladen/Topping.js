"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class Topping {
        constructor(_name, _price, _size, _color, _shape, _position, _velocitiy) {
            this.name = _name;
            this.price = _price;
            this.color = _color;
            this.shape = _shape;
            this.size = _size;
            this.position = _position;
            this.velocity = _velocitiy;
        }
        static getPhysicalCloneFrom(_primitiveTopping, _position, _velocity) {
            return new Topping(_primitiveTopping.name, _primitiveTopping.price, _primitiveTopping.size, _primitiveTopping.color, _primitiveTopping.shape, _position, _velocity);
        }
        calculate() {
            if (!this.stick) {
                if (this.isBeltCollision()) {
                    this.velocity = new Vector2D(Eisladen.ToppingPicker.beltSpeed, 0);
                }
                else {
                    this.velocity.add(Eisladen.gravity);
                }
                this.position.add(this.velocity);
                if (this.isContainerCollision()) {
                    this.stick = true;
                    if (Eisladen.IcePicker.stackedBalls.length > 0) {
                        let newToppingToPlace = new Topping(this.name, this.price, this.size, this.color, this.shape, new Vector2D(this.position.x, this.position.y), new Vector2D(this.velocity.x, this.velocity.y));
                        Eisladen.IcePicker.stackedBalls[Eisladen.IcePicker.stackedBalls.length - 1].placeToppingAround(newToppingToPlace);
                    }
                }
            }
        }
        isBeltCollision() {
            if (this.position.x < 0 || this.position.x > Eisladen.ToppingPicker.beltPosition.x + Eisladen.ToppingPicker.beltDimensions.x) {
                return false;
            }
            if (this.position.y < Eisladen.ToppingPicker.beltPosition.y - this.size) {
                return false;
            }
            return true;
        }
        isContainerCollision() {
            let xMin = Eisladen.ContainerSelector.ballImpactPoint.x - Eisladen.ContainerSelector.containerWidth / 2;
            let xMax = Eisladen.ContainerSelector.ballImpactPoint.x + Eisladen.ContainerSelector.containerWidth / 2;
            let yMin = Eisladen.ContainerSelector.ballImpactPoint.y - Eisladen.IceBall.ballHitYTolerance;
            let yMax = Eisladen.ContainerSelector.ballImpactPoint.y + Eisladen.IceBall.ballHitYTolerance;
            if (this.position.x < xMin || this.position.x > xMax) {
                return false;
            }
            if (this.position.y < yMin || this.position.y > yMax) {
                return false;
            }
            return true;
        }
        draw() {
            Eisladen.crc2.beginPath();
            Eisladen.crc2.fillStyle = this.color;
            if (this.shape == "arc") {
                Eisladen.crc2.arc(this.position.x, this.position.y, this.size / 2, 0 * Math.PI, 2 * Math.PI, false);
                Eisladen.crc2.fill();
            }
            if (this.shape == "rect") {
                let height;
                if (this.name == "Choclate Sprinkles") {
                    height = this.size / 3;
                }
                else {
                    height = this.size;
                }
                Eisladen.crc2.rect(this.position.x - this.size / 4, this.position.y, this.size - 2, height - 2);
                Eisladen.crc2.fill();
            }
        }
        getClone() {
            return new Topping(this.name, this.price, this.size, this.color, this.shape, this.position, this.velocity);
        }
    }
    Eisladen.Topping = Topping;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=Topping.js.map