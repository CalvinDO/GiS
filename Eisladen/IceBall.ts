namespace Eisladen {
    import Vector2D = IceVector.Vector2D;
    export class IceBall {
        public static ballHitYTolerance: number = 25;

        public position: Vector2D;
        public velocity: Vector2D;
        public radius: number;
        public iceSort: IceSort;
        public visible: boolean;
        public stick: boolean;

        public stickingToppings: Topping[] = [];
        public maxToppingsPerRow: number = 20;

        public stickingToppingsRowIndex: number = 0;

        constructor(_position: Vector2D, _velocitiy: Vector2D, _radius: number, _iceSort: IceSort, _visible: boolean) {
            this.position = _position;
            this.velocity = _velocitiy;

            this.radius = _radius;
            this.iceSort = _iceSort;
            this.visible = _visible;
        }
        public static generateFromSillyJSON(_iceBall: IceBall): IceBall {

            let newBall: IceBall = new IceBall(_iceBall.position, _iceBall.velocity, _iceBall.radius, _iceBall.iceSort, _iceBall.visible);
            newBall.position = new Vector2D(newBall.position.x, newBall.position.y);
            for (let index: number = 0; index < _iceBall.stickingToppings.length; index++) {
                newBall.stickingToppings[index] = Topping.getPhysicalCloneFrom(_iceBall.stickingToppings[index], _iceBall.stickingToppings[index].position, _iceBall.stickingToppings[index].velocity);
                newBall.stickingToppings[index].position = new Vector2D(newBall.stickingToppings[index].position.x, newBall.stickingToppings[index].position.y);
            }
            return newBall;
        }

        public calculate(_position: Vector2D, _velocity: Vector2D): void {
            this.velocity = new Vector2D(_velocity.x, _velocity.y);
            this.position = _position;
        }
        public calculateIndependent(): void {
            this.velocity.add(new Vector2D(Eisladen.gravity.x * deltaTime, Eisladen.gravity.y * deltaTime));

            if (this.stick) {
                this.velocity.scale(0);
            }
            this.position.add(new Vector2D(this.velocity.x * deltaTime, this.velocity.y * deltaTime));
            if (this.isContainerCollision()) {
                this.stick = true;
            }
        }
        public draw(): void {
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = this.iceSort.color;
            Eisladen.crc2.fillStyle = this.iceSort.color;
            Eisladen.crc2.arc(this.position.x, this.position.y, this.radius, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();

            for (let index: number = 0; index < this.stickingToppings.length; index++) {
                this.stickingToppings[index].draw();
            }
        }
        public isContainerCollision(): boolean {
            let xMin: number = ContainerSelector.ballImpactPoint.x - ContainerSelector.containerWidth / 2;
            let xMax: number = ContainerSelector.ballImpactPoint.x + ContainerSelector.containerWidth / 2;
            let yMin: number = ContainerSelector.ballImpactPoint.y - IceBall.ballHitYTolerance;
            let yMax: number = ContainerSelector.ballImpactPoint.y + IceBall.ballHitYTolerance;

            if (this.position.x < xMin || this.position.x > xMax) {
                return false;
            }
            if (this.position.y < yMin || this.position.y > yMax) {
                return false;
            }

            return true;
        }
        public placeToppingAround(_topping: Topping): void {
            let tempModulo: number = this.stickingToppings.length % this.maxToppingsPerRow;
            if (tempModulo == 0) {
                this.stickingToppingsRowIndex++;
            }

            let angle: number = 1.5 * Math.PI - ((this.stickingToppings.length) / this.maxToppingsPerRow) * Math.PI % Math.PI;
            let fakeRadius: number = this.radius + _topping.size * this.stickingToppingsRowIndex;
            let x: number = fakeRadius * Math.sin(angle) + this.position.x;
            let y: number = fakeRadius * Math.cos(angle) + this.position.y;
            _topping.position = new Vector2D(x, y);
            this.stickingToppings.push(_topping);
        }

        public clone(): IceBall {
            return new IceBall(this.position, this.velocity, this.radius, this.iceSort, this.visible);
        }

    }
}