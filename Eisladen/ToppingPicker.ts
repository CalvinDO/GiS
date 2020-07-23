namespace Eisladen {
    import Vector2D = Vector.Vector2D;
    export class ToppingPicker {
        public static toppings: Topping[];
        public static toppingBuckets: ToppingBucket[] = [];

        public static toppingBucketLeftOffset: number;

        public static beltPosition: Vector2D;
        public static beltDimensions: Vector2D;

        public static beltSpeed: number = 0.005;

        private static toppingBucketWidth: number;
        private static toppingBucketHeight: number;
        private static toppingBucketGap: number;

        private static toppingBucketBeltOffsetY: number;


        private beltCounterBarOffset: Vector2D;

        private wheelAmount: number = 40;

        private wheelRadius: number;
        private wheelBorderRadius: number = 5;
        private spokeAmount: number = 8;
        private spokeWidth: number = 3;

        private currentFrame: number = 0;

        private jsonLoadingFinished: boolean;

        constructor() {
            this.loadToppingsFromJSON("json/toppings.json");
        }

        public async loadToppingsFromJSON(_url: RequestInfo): Promise<void> {
            let response: Response = await fetch(_url);
            ToppingPicker.toppings = <Topping[]>await response.json();
            this.jsonLoadingFinished = true;
            this.generateToppingBuckets(ToppingPicker.toppings);
        }

        public generateToppingBuckets(_toppings: Topping[]): void {
            ToppingPicker.toppingBuckets = [];
            for (let index: number = 0; index < _toppings.length; index++) {
                let currentToppingBucketPosition: Vector2D = new Vector2D(ToppingPicker.toppingBucketLeftOffset, ToppingPicker.beltPosition.y - ToppingPicker.toppingBucketBeltOffsetY);
                currentToppingBucketPosition.add(new Vector2D(index * (ToppingPicker.toppingBucketWidth + ToppingPicker.toppingBucketGap), 0));
                let toppingBucketDimensions: Vector2D = new Vector2D(ToppingPicker.toppingBucketWidth, ToppingPicker.toppingBucketHeight);
                let currentToppingBucket: ToppingBucket = new ToppingBucket(currentToppingBucketPosition, toppingBucketDimensions, _toppings[index]);
                ToppingPicker.toppingBuckets.push(currentToppingBucket);
            }
        }
        public checkMouseClick(_x: number, _y: number): void {
            for (let index: number = 0; index < ToppingPicker.toppingBuckets.length; index++) {
                ToppingPicker.toppingBuckets[index].checkMouseClick(_x, _y);
            }
        }
        public calculate(_currentFrame: number): void {
            this.beltCounterBarOffset = new Vector2D(0, canvas.height / 11);
            ToppingPicker.beltPosition = new Vector2D(0, canvas.height / ContainerSelector.goldenRatio - this.beltCounterBarOffset.y);
            ToppingPicker.beltDimensions = new Vector2D(canvas.width / 2 - canvas.width * 0.1, canvas.height / 28);


            ToppingPicker.toppingBucketWidth = canvas.width / 15;
            ToppingPicker.toppingBucketGap = ToppingPicker.toppingBucketWidth / 4;
            ToppingPicker.toppingBucketHeight = canvas.height / 6;
            ToppingPicker.toppingBucketLeftOffset = ToppingPicker.toppingBucketGap * 2;
            ToppingPicker.toppingBucketBeltOffsetY = canvas.height / 9 + ToppingPicker.toppingBucketHeight;

            for (let index: number = 0; index < ToppingPicker.toppingBuckets.length; index++) {
                ToppingPicker.toppingBuckets[index].calculate(_currentFrame);
            }
            this.currentFrame = _currentFrame;
        }
        public draw(): void {
            this.drawBelt(ToppingPicker.beltPosition, ToppingPicker.beltDimensions);
            for (let index: number = 0; index < ToppingPicker.toppingBuckets.length; index++) {
                ToppingPicker.toppingBuckets[index].draw();
            }

        }
        private drawBelt(_position: Vector2D, _dimensions: Vector2D): void {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = _dimensions.y / 2;

            for (let index: number = 0; index < this.wheelAmount; index++) {
                let yPos: number = _position.y + (_dimensions.y / 2);
                let xPos: number = (_position.x + _dimensions.x) - (this.wheelRadius + ToppingPicker.beltPosition.x + index * (this.wheelRadius * 2 + this.wheelBorderRadius));
                let newPos: Vector2D = new Vector2D(xPos, yPos);
                let currentRotation: number = -timeSinceStart * ToppingPicker.beltSpeed;
                this.drawWheel(newPos, this.wheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
            }
        }
        private drawWheel(_position: Vector2D, _radius: number, _borderRadius: number, _rotation: number, _innerColor: string, _outerColor: string): void {
            Eisladen.crc2.lineWidth = _borderRadius;

            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _innerColor;
            Eisladen.crc2.arc(_position.x, _position.y, _radius, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
            for (let index: number = 0; index < this.spokeAmount; index++) {
                let currentAngle: number = index / this.spokeAmount * 2 * Math.PI + _rotation;

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
        private drawChain(_position: Vector2D, _dimensions: Vector2D, _innerColor: string, _outerColor: string): void {
            Eisladen.crc2.lineWidth = 7;
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _innerColor;
            Eisladen.crc2.rect(_position.x, _position.y, _dimensions.x, _dimensions.y);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
        }
    }
}