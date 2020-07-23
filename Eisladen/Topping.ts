namespace Eisladen {
    import Vector2D = Vector.Vector2D;

    export class Topping {
        public name: string;
        public price: number;
        public color: string;
        public shape: string;

        public size: number;
        public position: Vector2D;
        public velocity: Vector2D;

        public stick: boolean;

        constructor(_name: string, _price: number, _size: number, _color: string, _shape: string, _position: Vector2D, _velocitiy: Vector2D) {
            this.name = _name;
            this.price = _price;
            this.color = _color;
            this.shape = _shape;

            this.size = _size;

            this.position = _position;
            this.velocity = _velocitiy;
        }

        public static getPhysicalCloneFrom(_primitiveTopping: Topping, _position: Vector2D, _velocity: Vector2D): Topping {
            return new Topping(_primitiveTopping.name, _primitiveTopping.price, _primitiveTopping.size, _primitiveTopping.color, _primitiveTopping.shape, _position, _velocity);
        }

        public calculate(): void {
            if (!this.stick) {

                if (this.isBeltCollision()) {
                    this.velocity = new Vector2D(ToppingPicker.beltSpeed, 0);
                } else {
                    this.velocity.add(Eisladen.gravity);
                }
                this.position.add(this.velocity);
                if (this.isContainerCollision()) {
                    this.stick = true;
                    if (IcePicker.stackedBalls.length > 0) {

                        let newToppingToPlace: Topping = new Topping(this.name, this.price, this.size, this.color, this.shape, new Vector2D(this.position.x, this.position.y), new Vector2D(this.velocity.x, this.velocity.y));
                        IcePicker.stackedBalls[IcePicker.stackedBalls.length - 1].placeToppingAround(newToppingToPlace);
                    }
                }
            }
        }

        public isBeltCollision(): boolean {
            if (this.position.x < 0 || this.position.x > ToppingPicker.beltPosition.x + ToppingPicker.beltDimensions.x) {
                return false;
            }
            if (this.position.y < ToppingPicker.beltPosition.y - this.size) {
                return false;
            }
            return true;
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

        public draw(): void {
            Eisladen.crc2.beginPath();
            Eisladen.crc2.fillStyle = this.color;
            if (this.shape == "arc") {
                Eisladen.crc2.arc(this.position.x, this.position.y, this.size / 2, 0 * Math.PI, 2 * Math.PI, false);
                Eisladen.crc2.fill();
            }
            if (this.shape == "rect") {
                let height: number;
                if (this.name == "Choclate Sprinkles") {
                    height = this.size / 3;
                } else {
                    height = this.size;
                }
                Eisladen.crc2.rect(this.position.x - this.size / 4, this.position.y, this.size - 2, height - 2);
                Eisladen.crc2.fill();
            }
        }

        public getClone(): Topping {
            return new Topping(this.name, this.price, this.size, this.color, this.shape, this.position, this.velocity);
        }
    }
}