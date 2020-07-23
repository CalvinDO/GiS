namespace Eisladen {
    import Vector2D = Vector.Vector2D;

    export class IcePicker {
        public static shovelRadius: number;
        public static stackedBalls: IceBall[];
        public static iceBucketCounterBarOffset: Vector2D;

        private static buttonLeft: HTMLImageElement;
        private static buttonRight: HTMLImageElement;

        private static currentBucketSelect: number;

        private static iceBuckets: IceBucket[];
        private static iceBucketWidth: number;
        private static iceBucketHeight: number;
        private static iceBucketGap: number;

        private static iceSorts: IceSort[] = [];

        private static maxIceBucketsDisplay: number = 4;

        private counterBar: HTMLDivElement;
        private counterBarPosition: Vector2D;

        private beltPosition: Vector2D;
        private beltDimensions: Vector2D;

        private trolleyPosition: Vector2D;
        private trolleyDimensions: Vector2D;

        private currentTrolleyOffset: number = 0;
        private currentLength: number = 100;
        private maxTrolleyLength: number = 1000;
        private minTrolleyLength: number = 10;

        private trolleyChainWidth: number = 7;
        private yTrolleyChainEnd: number;

        private shovelBorderRadius: number = 8;

        private currentShovelAngle: number = 0 * Math.PI;
        private maxShovelAngle: number = 2;
        private shovelAngleSpeed: number = 0.1;
        private shovelOpen: boolean = true;
        private shovelClosed: boolean;
        private shovelTransition: boolean;
        private shovelInsideBucket: boolean;

        private grabValid: boolean = true;
        private ballGrabbed: boolean;

        private grabbedIceSort: IceSort;
        private grabbedIceBucketIndex: number;
        private grabbedIceBall: IceBall;
        private inAirIceBalls: IceBall[];


        private shovelPosition: Vector2D;

        private wheelRadius: number;
        private wheelBorderRadius: number = 5;
        private spokeAmount: number = 6;
        private spokeWidth: number = 3;

        private currentFrame: number;

        private wheelAmount: number = 50;


        private accelIncrement: Vector2D = new Vector2D(0.24, 0.2);
        private accel: Vector2D = new Vector2D(0, 0);
        private currentSpeed: Vector2D = new Vector2D(0, 0);
        private friction: number = 0.985;


        private jsonLoadingFinished: boolean;

        constructor() {
            this.counterBar = <HTMLDivElement>document.querySelector("#counter-bar");
            this.counterBarPosition = new Vector2D(this.counterBar.getBoundingClientRect().x, this.counterBar.getBoundingClientRect().y);
            this.loadIceSortsFromJSON("json/iceSorts.json");


            IcePicker.buttonRight = <HTMLImageElement>document.querySelector(".bucketMenuArrow:nth-child(2)");
            IcePicker.buttonLeft = <HTMLImageElement>document.querySelector(".bucketMenuArrow:nth-child(1)");

            IcePicker.buttonRight.addEventListener("click", IcePicker.handleContainerSelectLeft);
            IcePicker.buttonLeft.addEventListener("click", IcePicker.handleContainerSelectRight);

            IcePicker.currentBucketSelect = 0;

            IcePicker.stackedBalls = [];

            if (Eisladen.localStorageIceOrderIceBallsReady) {
                for (let index: number = 0; index < Eisladen.iceOrder.container.iceBalls.length; index++) {
                    let currentSillyIceBall: IceBall = Eisladen.iceOrder.container.iceBalls[index];
                    IcePicker.stackedBalls[index] = IceBall.generateFromSillyJSON(currentSillyIceBall);
                }
            }
        }

        public static handleContainerSelectRight(_event: Event): void {
            if (IcePicker.currentBucketSelect < 0) {
                IcePicker.currentBucketSelect += 1;
                IcePicker.moveBucketSelection(1);
            }
        }
        public static handleContainerSelectLeft(_event: Event): void {
            if (IcePicker.currentBucketSelect > (-IcePicker.iceBuckets.length + IcePicker.maxIceBucketsDisplay)) {
                IcePicker.currentBucketSelect -= 1;
                IcePicker.moveBucketSelection(-1);
            }
        }

        public static moveBucketSelection(_value: number): void {
            let offset: number = _value * (IcePicker.iceBucketWidth + IcePicker.iceBucketGap);
            for (let index: number = 0; index < IcePicker.iceBuckets.length; index++) {
                let translation: Vector2D = new Vector2D(offset, 0);
                IcePicker.iceBuckets[index].position.add(translation);
                IcePicker.iceBuckets[index].moveTags(translation);
            }
        }
        public async loadIceSortsFromJSON(_url: RequestInfo): Promise<void> {
            let response: Response = await fetch(_url);
            IcePicker.iceSorts = <IceSort[]>await response.json();
            this.jsonLoadingFinished = true;
            this.generateIceBuckets(IcePicker.iceSorts);
        }

        public generateIceBuckets(_iceSorts: IceSort[]): void {
            IcePicker.iceBuckets = [];
            for (let index: number = 0; index < _iceSorts.length; index++) {
                let currentIceBucketPosition: Vector2D = new Vector2D(this.trolleyPosition.x + IcePicker.iceBucketCounterBarOffset.x, this.counterBarPosition.y - IcePicker.iceBucketCounterBarOffset.y);
                currentIceBucketPosition.add(new Vector2D(index * (IcePicker.iceBucketWidth + IcePicker.iceBucketGap), 0));
                let iceBucketDimensions: Vector2D = new Vector2D(IcePicker.iceBucketWidth, IcePicker.iceBucketHeight);
                let currentIceBucket: IceBucket = new IceBucket(currentIceBucketPosition, iceBucketDimensions, _iceSorts[index]);
                IcePicker.iceBuckets.push(currentIceBucket);

            }
        }

        public controlShovel(): void {
            if (spaceKey) {
                this.currentShovelAngle += this.shovelAngleSpeed;
            } else {
                this.currentShovelAngle -= this.shovelAngleSpeed;
            }

            this.shovelTransition = true;
            this.shovelOpen = false;
            this.shovelClosed = false;

            if (this.currentShovelAngle < 0) {
                this.currentShovelAngle = 0;
                this.shovelOpen = true;
            }
            if (this.currentShovelAngle > this.maxShovelAngle) {
                this.currentShovelAngle = this.maxShovelAngle;
                this.shovelClosed = true;
            }
            this.shovelTransition = !(this.shovelClosed || this.shovelOpen);

            this.checkGrab();
        }
        public checkGrab(): void {
            if (this.jsonLoadingFinished) {
                for (let index: number = 0; index < IcePicker.iceBuckets.length; index++) {
                    let currentBucket: IceBucket = IcePicker.iceBuckets[index];
                    if (currentBucket.isShovelInBucket(this.shovelPosition, IcePicker.shovelRadius)) {
                        this.shovelInsideBucket = true;
                        this.grabbedIceSort = currentBucket.iceSort;
                        this.grabbedIceBucketIndex = index;
                        break;
                    }
                    this.shovelInsideBucket = false;
                }
            }
            if (!this.shovelInsideBucket) {
                if (this.shovelOpen) {
                    this.grabValid = true;
                } else {
                    this.grabValid = false;
                }
            } else if (this.shovelOpen) {
                this.grabValid = true;
            }
            if (this.shovelInsideBucket && this.shovelClosed && this.grabValid) {
                this.ballGrabbed = true;
            }
            if (!this.shovelClosed) {
                this.ballGrabbed = false;
            }
        }

        public calculate(_currentFrame: number): void {
            this.currentFrame = _currentFrame;
            this.beltPosition = new Vector2D(Eisladen.canvas.width / 2 - Eisladen.canvas.width * 0.05, Eisladen.canvas.width * 0.15);
            this.beltDimensions = new Vector2D(Eisladen.canvas.width - this.beltPosition.x, 30);

            this.trolleyDimensions = new Vector2D(this.beltDimensions.x / 6, this.beltDimensions.y);
            this.trolleyPosition = new Vector2D(this.currentTrolleyOffset + this.beltPosition.x, this.beltPosition.y);
            this.maxTrolleyLength = Eisladen.canvas.height / ContainerSelector.goldenRatio - this.trolleyPosition.y;

            this.shovelPosition = new Vector2D(this.trolleyPosition.x + this.trolleyDimensions.x / 2, this.yTrolleyChainEnd + IcePicker.shovelRadius);

            IcePicker.iceBucketCounterBarOffset = new Vector2D(canvas.width / 8, canvas.height / 7.5);
            IcePicker.iceBucketWidth = canvas.width / 11;
            IcePicker.iceBucketHeight = canvas.height / 9;
            IcePicker.iceBucketGap = IcePicker.iceBucketWidth / 7.5;

            this.manageIceBalls();

            this.moveTrolley();
            this.controlShovel();
        }
        public manageIceBalls(): void {
            if (this.ballGrabbed && !this.grabbedIceBall || this.ballGrabbed && !this.grabbedIceBall.visible) {
                this.grabbedIceBall = new IceBall(this.shovelPosition, this.currentSpeed, IcePicker.shovelRadius - this.shovelBorderRadius, this.grabbedIceSort, true);
                IcePicker.iceBuckets[this.grabbedIceBucketIndex].setCutOut(this.shovelPosition, IcePicker.shovelRadius - this.shovelBorderRadius, this.currentFrame);
                totalPriceWithoutContainer += IcePicker.iceBuckets[this.grabbedIceBucketIndex].iceSort.price;
                Eisladen.updateLocalStorage();
            }
            if (this.grabbedIceBall) {
                if (this.grabbedIceBall.visible) {
                    this.grabbedIceBall.calculate(this.shovelPosition, this.currentSpeed);
                    if (!this.ballGrabbed) {
                        if (!this.inAirIceBalls) {
                            this.inAirIceBalls = [];
                        }
                        let copyBall: IceBall = new IceBall(this.grabbedIceBall.position, this.grabbedIceBall.velocity, this.grabbedIceBall.radius, this.grabbedIceBall.iceSort, true);
                        this.grabbedIceBall.visible = false;
                        this.inAirIceBalls.push(copyBall);
                    }
                }
            }
            if (this.inAirIceBalls && this.inAirIceBalls.length > 0) {
                for (let index: number = 0; index < this.inAirIceBalls.length; index++) {
                    let currentAirBall: IceBall = this.inAirIceBalls[index];
                    if (!currentAirBall.stick) {
                        currentAirBall.calculateIndependent();
                    } else {
                        let stackBall: IceBall = new IceBall(currentAirBall.position, currentAirBall.velocity, currentAirBall.radius, currentAirBall.iceSort, true);
                        stackBall.stick = true;
                        IcePicker.stackedBalls.push(stackBall);
                        Eisladen.iceOrder.container.iceBalls = IcePicker.stackedBalls;
                        Eisladen.updateLocalStorage();
                        this.inAirIceBalls.pop();
                        for (let index: number = 0; index < IcePicker.stackedBalls.length; index++) {
                            let currentBall: IceBall = IcePicker.stackedBalls[index];
                            currentBall.position.add(ContainerSelector.offsetPerBall);
                            for (let topIndex: number = 0; topIndex < currentBall.stickingToppings.length; topIndex++) {
                                currentBall.stickingToppings[topIndex].position.add(ContainerSelector.offsetPerBall);
                            }
                        }
                    }
                }
            }


        }
        public draw(_currentFrame: number): void {
            this.drawBelt();
            this.drawTrolley(this.trolleyPosition, this.trolleyDimensions, "lightgray", "black");

            if (IcePicker.iceBuckets) {
                for (let index: number = 0; index < IcePicker.iceBuckets.length; index++) {
                    IcePicker.iceBuckets[index].draw();
                    IcePicker.iceBuckets[index].drawCutOut(this.currentFrame);
                }
            }

            this.drawTrolleyChain("black");
            this.drawShovel("black");

            if (this.grabbedIceBall) {
                if (this.grabbedIceBall.visible) {
                    this.grabbedIceBall.draw();
                }
            }
            if (this.inAirIceBalls && this.inAirIceBalls.length > 0) {
                for (let index: number = 0; index < this.inAirIceBalls.length; index++) {
                    this.inAirIceBalls[index].draw();
                }
            }
            for (let index: number = 0; index < IcePicker.stackedBalls.length; index++) {
                IcePicker.stackedBalls[index].draw();
            }
        }
        public moveTrolley(): void {
            if (rightKey) {
                this.accel.x = this.accelIncrement.x;
            } else if (leftKey) {
                this.accel.x = -this.accelIncrement.x;
            } else {
                this.accel.x = 0;
            }
            if (upKey) {
                this.accel.y = -this.accelIncrement.y;
            } else if (downKey) {
                this.accel.y = this.accelIncrement.y;
            } else {
                this.accel.y = 0;
            }

            this.currentSpeed.add(this.accel);

            this.currentSpeed.scale(this.friction);

            if (this.currentSpeed.x < 0 && this.currentTrolleyOffset < 0) {
                this.currentSpeed.x *= -1;
            }
            if (this.currentSpeed.x > 0 && this.currentTrolleyOffset + this.trolleyDimensions.x > this.beltDimensions.x) {
                this.currentSpeed.x *= -1;
            }
            if (this.currentSpeed.y < 0 && this.currentLength < this.minTrolleyLength) {
                this.currentSpeed.y *= -1;
            }
            if (this.currentSpeed.y > 0 && this.currentLength > this.maxTrolleyLength) {
                this.currentSpeed.y *= -1;
            }

            this.currentTrolleyOffset += this.currentSpeed.x;
            this.currentLength += this.currentSpeed.y;
        }

        private drawBelt(): void {
            this.drawChain(this.beltPosition, this.beltDimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = this.beltDimensions.y / 2;

            for (let index: number = 0; index < this.wheelAmount; index++) {
                let yPos: number = this.beltPosition.y + (this.beltDimensions.y / 2);
                let xPos: number = this.wheelRadius + this.beltPosition.x + index * (this.wheelRadius * 2 + this.wheelBorderRadius);
                let newPos: Vector2D = new Vector2D(xPos, yPos);
                let currentRotation: number = 0.01 * this.currentTrolleyOffset;
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
        private drawTrolley(_position: Vector2D, _dimensions: Vector2D, _innerColor: string, _outerColor: string): void {
            Eisladen.crc2.lineWidth = 7;
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _innerColor;
            Eisladen.crc2.rect(_position.x, _position.y, _dimensions.x, _dimensions.y);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();

            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.fillStyle = _outerColor;
            let yMiddle: number = this.trolleyDimensions.y / 2 + this.trolleyPosition.y;
            Eisladen.crc2.arc(this.trolleyPosition.x + this.trolleyDimensions.x / 2, yMiddle, IcePicker.shovelRadius / 10, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
        }
        private drawTrolleyChain(_innerColor: string): void {
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _innerColor;
            Eisladen.crc2.lineWidth = this.trolleyChainWidth;
            let x: number = this.trolleyPosition.x + this.trolleyDimensions.x / 2;
            let yStart: number = this.trolleyDimensions.y / 2 + this.trolleyPosition.y;
            this.yTrolleyChainEnd = this.trolleyDimensions.y + this.trolleyPosition.y + this.currentLength;
            Eisladen.crc2.moveTo(x, yStart);
            Eisladen.crc2.lineTo(x, this.yTrolleyChainEnd);
            Eisladen.crc2.stroke();
        }
        private drawShovel(_outerColor: string): void {
            Eisladen.crc2.lineWidth = this.shovelBorderRadius;

            IcePicker.shovelRadius = Eisladen.canvas.width * 0.02;

            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;

            Eisladen.crc2.arc(this.shovelPosition.x, this.shovelPosition.y, IcePicker.shovelRadius, 1 * Math.PI - this.currentShovelAngle, 2 * Math.PI + this.currentShovelAngle, false);
            Eisladen.crc2.stroke();
        }
    }
}