"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class IceBall {
        constructor(_position, _velocitiy, _radius, _iceSort, _visible) {
            this.stickingToppings = [];
            this.maxToppingsPerRow = 20;
            this.stickingToppingsRowIndex = 0;
            this.position = _position;
            this.velocity = _velocitiy;
            this.radius = _radius;
            this.iceSort = _iceSort;
            this.visible = _visible;
        }
        static generateFromSillyJSON(_iceBall) {
            let newBall = new IceBall(_iceBall.position, _iceBall.velocity, _iceBall.radius, _iceBall.iceSort, _iceBall.visible);
            newBall.position = new Vector2D(newBall.position.x, newBall.position.y);
            for (let index = 0; index < _iceBall.stickingToppings.length; index++) {
                newBall.stickingToppings[index] = Eisladen.Topping.getPhysicalCloneFrom(_iceBall.stickingToppings[index], _iceBall.stickingToppings[index].position, _iceBall.stickingToppings[index].velocity);
                newBall.stickingToppings[index].position = new Vector2D(newBall.stickingToppings[index].position.x, newBall.stickingToppings[index].position.y);
            }
            return newBall;
        }
        calculate(_position, _velocity) {
            this.velocity = new Vector2D(_velocity.x, _velocity.y);
            this.position = _position;
        }
        calculateIndependent() {
            this.velocity.add(Eisladen.gravity);
            if (this.stick) {
                this.velocity.scale(0);
            }
            this.position.add(this.velocity);
            if (this.isContainerCollision()) {
                this.stick = true;
            }
        }
        draw() {
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = this.iceSort.color;
            Eisladen.crc2.fillStyle = this.iceSort.color;
            Eisladen.crc2.arc(this.position.x, this.position.y, this.radius, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
            for (let index = 0; index < this.stickingToppings.length; index++) {
                this.stickingToppings[index].draw();
            }
        }
        isContainerCollision() {
            let xMin = Eisladen.ContainerSelector.ballImpactPoint.x - Eisladen.ContainerSelector.containerWidth / 2;
            let xMax = Eisladen.ContainerSelector.ballImpactPoint.x + Eisladen.ContainerSelector.containerWidth / 2;
            let yMin = Eisladen.ContainerSelector.ballImpactPoint.y - IceBall.ballHitYTolerance;
            let yMax = Eisladen.ContainerSelector.ballImpactPoint.y + IceBall.ballHitYTolerance;
            if (this.position.x < xMin || this.position.x > xMax) {
                return false;
            }
            if (this.position.y < yMin || this.position.y > yMax) {
                return false;
            }
            return true;
        }
        placeToppingAround(_topping) {
            let tempModulo = this.stickingToppings.length % this.maxToppingsPerRow;
            if (tempModulo == 0) {
                this.stickingToppingsRowIndex++;
            }
            let angle = 1.5 * Math.PI - ((this.stickingToppings.length) / this.maxToppingsPerRow) * Math.PI % Math.PI;
            let fakeRadius = this.radius + _topping.size * this.stickingToppingsRowIndex;
            let x = fakeRadius * Math.sin(angle) + this.position.x;
            let y = fakeRadius * Math.cos(angle) + this.position.y;
            _topping.position = new Vector2D(x, y);
            this.stickingToppings.push(_topping);
        }
        clone() {
            return new IceBall(this.position, this.velocity, this.radius, this.iceSort, this.visible);
        }
    }
    IceBall.ballHitYTolerance = 25;
    Eisladen.IceBall = IceBall;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=IceBall.js.map