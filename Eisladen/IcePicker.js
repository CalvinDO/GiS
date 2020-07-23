"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class IcePicker {
        constructor() {
            this.currentTrolleyOffset = 0;
            this.currentLength = 100;
            this.maxTrolleyLength = 1000;
            this.minTrolleyLength = 10;
            this.trolleyChainWidth = 7;
            this.shovelBorderRadius = 8;
            this.currentShovelAngle = 0 * Math.PI;
            this.maxShovelAngle = 2;
            this.shovelAngleSpeed = 0.005;
            this.shovelOpen = true;
            this.grabValid = true;
            this.wheelBorderRadius = 5;
            this.spokeAmount = 6;
            this.spokeWidth = 3;
            this.wheelAmount = 50;
            this.accelIncrement = new Vector2D(0.0008, 0.0006);
            this.accel = new Vector2D(0, 0);
            this.currentSpeed = new Vector2D(0, 0);
            this.friction = 0.985;
            this.counterBar = document.querySelector("#counter-bar");
            this.counterBarPosition = new Vector2D(this.counterBar.getBoundingClientRect().x, this.counterBar.getBoundingClientRect().y);
            this.loadIceSortsFromJSON("json/iceSorts.json");
            IcePicker.buttonRight = document.querySelector(".bucketMenuArrow:nth-child(2)");
            IcePicker.buttonLeft = document.querySelector(".bucketMenuArrow:nth-child(1)");
            IcePicker.buttonRight.addEventListener("click", IcePicker.handleContainerSelectLeft);
            IcePicker.buttonLeft.addEventListener("click", IcePicker.handleContainerSelectRight);
            IcePicker.currentBucketSelect = 0;
            IcePicker.stackedBalls = [];
            if (Eisladen.localStorageIceOrderIceBallsReady) {
                for (let index = 0; index < Eisladen.iceOrder.container.iceBalls.length; index++) {
                    let currentSillyIceBall = Eisladen.iceOrder.container.iceBalls[index];
                    IcePicker.stackedBalls[index] = Eisladen.IceBall.generateFromSillyJSON(currentSillyIceBall);
                }
            }
        }
        static handleContainerSelectRight(_event) {
            if (IcePicker.currentBucketSelect < 0) {
                IcePicker.currentBucketSelect += 1;
                IcePicker.moveBucketSelection(1);
            }
        }
        static handleContainerSelectLeft(_event) {
            if (IcePicker.currentBucketSelect > (-IcePicker.iceBuckets.length + IcePicker.maxIceBucketsDisplay)) {
                IcePicker.currentBucketSelect -= 1;
                IcePicker.moveBucketSelection(-1);
            }
        }
        static moveBucketSelection(_value) {
            let offset = _value * (IcePicker.iceBucketWidth + IcePicker.iceBucketGap);
            for (let index = 0; index < IcePicker.iceBuckets.length; index++) {
                let translation = new Vector2D(offset, 0);
                IcePicker.iceBuckets[index].position.add(translation);
                IcePicker.iceBuckets[index].moveTags(translation);
            }
        }
        async loadIceSortsFromJSON(_url) {
            let response = await fetch(_url);
            IcePicker.iceSorts = await response.json();
            this.jsonLoadingFinished = true;
            this.generateIceBuckets(IcePicker.iceSorts);
        }
        generateIceBuckets(_iceSorts) {
            IcePicker.iceBuckets = [];
            for (let index = 0; index < _iceSorts.length; index++) {
                let currentIceBucketPosition = new Vector2D(this.trolleyPosition.x + IcePicker.iceBucketCounterBarOffset.x, this.counterBarPosition.y - IcePicker.iceBucketCounterBarOffset.y);
                currentIceBucketPosition.add(new Vector2D(index * (IcePicker.iceBucketWidth + IcePicker.iceBucketGap), 0));
                let iceBucketDimensions = new Vector2D(IcePicker.iceBucketWidth, IcePicker.iceBucketHeight);
                let currentIceBucket = new Eisladen.IceBucket(currentIceBucketPosition, iceBucketDimensions, _iceSorts[index]);
                IcePicker.iceBuckets.push(currentIceBucket);
            }
        }
        controlShovel() {
            if (Eisladen.spaceKey) {
                this.currentShovelAngle += this.shovelAngleSpeed * Eisladen.deltaTime;
            }
            else {
                this.currentShovelAngle -= this.shovelAngleSpeed * Eisladen.deltaTime;
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
        checkGrab() {
            if (this.jsonLoadingFinished) {
                for (let index = 0; index < IcePicker.iceBuckets.length; index++) {
                    let currentBucket = IcePicker.iceBuckets[index];
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
                }
                else {
                    this.grabValid = false;
                }
            }
            else if (this.shovelOpen) {
                this.grabValid = true;
            }
            if (this.shovelInsideBucket && this.shovelClosed && this.grabValid) {
                this.ballGrabbed = true;
            }
            if (!this.shovelClosed) {
                this.ballGrabbed = false;
            }
        }
        calculate(_currentFrame) {
            this.currentFrame = _currentFrame;
            this.beltPosition = new Vector2D(Eisladen.canvas.width / 2 - Eisladen.canvas.width * 0.05, Eisladen.canvas.width * 0.15);
            this.beltDimensions = new Vector2D(Eisladen.canvas.width - this.beltPosition.x, 30);
            this.trolleyDimensions = new Vector2D(this.beltDimensions.x / 6, this.beltDimensions.y);
            this.trolleyPosition = new Vector2D(this.currentTrolleyOffset + this.beltPosition.x, this.beltPosition.y);
            this.maxTrolleyLength = Eisladen.canvas.height / Eisladen.ContainerSelector.goldenRatio - this.trolleyPosition.y;
            this.shovelPosition = new Vector2D(this.trolleyPosition.x + this.trolleyDimensions.x / 2, this.yTrolleyChainEnd + IcePicker.shovelRadius);
            IcePicker.iceBucketCounterBarOffset = new Vector2D(Eisladen.canvas.width / 8, Eisladen.canvas.height / 7.5);
            IcePicker.iceBucketWidth = Eisladen.canvas.width / 11;
            IcePicker.iceBucketHeight = Eisladen.canvas.height / 9;
            IcePicker.iceBucketGap = IcePicker.iceBucketWidth / 7.5;
            this.manageIceBalls();
            this.moveTrolley();
            this.controlShovel();
        }
        manageIceBalls() {
            if (this.ballGrabbed && !this.grabbedIceBall || this.ballGrabbed && !this.grabbedIceBall.visible) {
                this.grabbedIceBall = new Eisladen.IceBall(this.shovelPosition, this.currentSpeed, IcePicker.shovelRadius - this.shovelBorderRadius, this.grabbedIceSort, true);
                IcePicker.iceBuckets[this.grabbedIceBucketIndex].setCutOut(this.shovelPosition, IcePicker.shovelRadius - this.shovelBorderRadius, this.currentFrame);
                Eisladen.totalPriceWithoutContainer += IcePicker.iceBuckets[this.grabbedIceBucketIndex].iceSort.price;
                Eisladen.updateLocalStorage();
            }
            if (this.grabbedIceBall) {
                if (this.grabbedIceBall.visible) {
                    this.grabbedIceBall.calculate(this.shovelPosition, this.currentSpeed);
                    if (!this.ballGrabbed) {
                        if (!this.inAirIceBalls) {
                            this.inAirIceBalls = [];
                        }
                        let copyBall = new Eisladen.IceBall(this.grabbedIceBall.position, new Vector2D(this.grabbedIceBall.velocity.x / Eisladen.deltaTime, this.grabbedIceBall.velocity.y / Eisladen.deltaTime), this.grabbedIceBall.radius, this.grabbedIceBall.iceSort, true);
                        this.grabbedIceBall.visible = false;
                        this.inAirIceBalls.push(copyBall);
                    }
                }
            }
            if (this.inAirIceBalls && this.inAirIceBalls.length > 0) {
                for (let index = 0; index < this.inAirIceBalls.length; index++) {
                    let currentAirBall = this.inAirIceBalls[index];
                    if (!currentAirBall.stick) {
                        currentAirBall.calculateIndependent();
                    }
                    else {
                        let stackBall = new Eisladen.IceBall(currentAirBall.position, currentAirBall.velocity, currentAirBall.radius, currentAirBall.iceSort, true);
                        stackBall.stick = true;
                        IcePicker.stackedBalls.push(stackBall);
                        Eisladen.iceOrder.container.iceBalls = IcePicker.stackedBalls;
                        Eisladen.updateLocalStorage();
                        this.inAirIceBalls.pop();
                        for (let index = 0; index < IcePicker.stackedBalls.length; index++) {
                            let currentBall = IcePicker.stackedBalls[index];
                            currentBall.position.add(Eisladen.ContainerSelector.offsetPerBall);
                            for (let topIndex = 0; topIndex < currentBall.stickingToppings.length; topIndex++) {
                                currentBall.stickingToppings[topIndex].position.add(Eisladen.ContainerSelector.offsetPerBall);
                            }
                        }
                    }
                }
            }
        }
        draw(_currentFrame) {
            this.drawBelt();
            this.drawTrolley(this.trolleyPosition, this.trolleyDimensions, "lightgray", "black");
            if (IcePicker.iceBuckets) {
                for (let index = 0; index < IcePicker.iceBuckets.length; index++) {
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
                for (let index = 0; index < this.inAirIceBalls.length; index++) {
                    this.inAirIceBalls[index].draw();
                }
            }
            for (let index = 0; index < IcePicker.stackedBalls.length; index++) {
                IcePicker.stackedBalls[index].draw();
            }
        }
        moveTrolley() {
            if (Eisladen.rightKey) {
                this.accel.x = this.accelIncrement.x * Eisladen.deltaTime;
            }
            else if (Eisladen.leftKey) {
                this.accel.x = -this.accelIncrement.x * Eisladen.deltaTime;
            }
            else {
                this.accel.x = 0;
            }
            if (Eisladen.upKey) {
                this.accel.y = -this.accelIncrement.y * Eisladen.deltaTime;
            }
            else if (Eisladen.downKey) {
                this.accel.y = this.accelIncrement.y * Eisladen.deltaTime;
            }
            else {
                this.accel.y = 0;
            }
            this.currentSpeed.add(new Vector2D(this.accel.x * Eisladen.deltaTime, this.accel.y * Eisladen.deltaTime));
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
        drawBelt() {
            this.drawChain(this.beltPosition, this.beltDimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = this.beltDimensions.y / 2;
            for (let index = 0; index < this.wheelAmount; index++) {
                let yPos = this.beltPosition.y + (this.beltDimensions.y / 2);
                let xPos = this.wheelRadius + this.beltPosition.x + index * (this.wheelRadius * 2 + this.wheelBorderRadius);
                let newPos = new Vector2D(xPos, yPos);
                let currentRotation = 0.01 * this.currentTrolleyOffset;
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
        drawTrolley(_position, _dimensions, _innerColor, _outerColor) {
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
            let yMiddle = this.trolleyDimensions.y / 2 + this.trolleyPosition.y;
            Eisladen.crc2.arc(this.trolleyPosition.x + this.trolleyDimensions.x / 2, yMiddle, IcePicker.shovelRadius / 10, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.crc2.stroke();
            Eisladen.crc2.fill();
        }
        drawTrolleyChain(_innerColor) {
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _innerColor;
            Eisladen.crc2.lineWidth = this.trolleyChainWidth;
            let x = this.trolleyPosition.x + this.trolleyDimensions.x / 2;
            let yStart = this.trolleyDimensions.y / 2 + this.trolleyPosition.y;
            this.yTrolleyChainEnd = this.trolleyDimensions.y + this.trolleyPosition.y + this.currentLength;
            Eisladen.crc2.moveTo(x, yStart);
            Eisladen.crc2.lineTo(x, this.yTrolleyChainEnd);
            Eisladen.crc2.stroke();
        }
        drawShovel(_outerColor) {
            Eisladen.crc2.lineWidth = this.shovelBorderRadius;
            IcePicker.shovelRadius = Eisladen.canvas.width * 0.02;
            Eisladen.crc2.beginPath();
            Eisladen.crc2.strokeStyle = _outerColor;
            Eisladen.crc2.arc(this.shovelPosition.x, this.shovelPosition.y, IcePicker.shovelRadius, 1 * Math.PI - this.currentShovelAngle, 2 * Math.PI + this.currentShovelAngle, false);
            Eisladen.crc2.stroke();
        }
    }
    IcePicker.iceSorts = [];
    IcePicker.maxIceBucketsDisplay = 4;
    Eisladen.IcePicker = IcePicker;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=IcePicker.js.map