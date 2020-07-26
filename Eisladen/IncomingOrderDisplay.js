"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = IceVector.Vector2D;
    class IncomingOrderDisplay {
        constructor() {
            this.wheelAmount = 60;
            this.wheelBorderRadius = 5;
            this.spokeAmount = 8;
            this.spokeWidth = 3;
            IncomingOrderDisplay.beltPosition = new Vector2D(0, Eisladen.sellerCanvas.height / IncomingOrderDisplay.yOffsetPercentage);
            IncomingOrderDisplay.incomingOrders = [];
            IncomingOrderDisplay.orderStartPosition = new Vector2D(Eisladen.sellerCanvas.width / 20, IncomingOrderDisplay.beltPosition.y);
            IncomingOrderDisplay.orderStartVelocity = new Vector2D(IncomingOrderDisplay.beltSpeed * 100, 0);
            IncomingOrderDisplay.buttonLeft = document.querySelector("#switchLeft");
            IncomingOrderDisplay.buttonRight = document.querySelector("#switchRight");
            console.log(IncomingOrderDisplay.buttonRight);
            IncomingOrderDisplay.buttonLeft.addEventListener("click", IncomingOrderDisplay.handleSwitchLeft);
            IncomingOrderDisplay.buttonRight.addEventListener("click", IncomingOrderDisplay.handleSwitchRight);
            this.checkForData();
        }
        static handleSwitchRight(_event) {
            IncomingOrderDisplay.currentSwitchNumber += IncomingOrderDisplay.currentSwitchNumber < 2 ? 1 : 0;
            IncomingOrderDisplay.toggleSwitchState(IncomingOrderDisplay.currentSwitchNumber);
        }
        static handleSwitchLeft(_event) {
            IncomingOrderDisplay.currentSwitchNumber -= IncomingOrderDisplay.currentSwitchNumber > 0 ? 1 : 0;
            IncomingOrderDisplay.toggleSwitchState(IncomingOrderDisplay.currentSwitchNumber);
        }
        static toggleSwitchState(_value) {
            switch (_value) {
                case 0:
                    IncomingOrderDisplay.currentSwitch = Eisladen.Switches.left;
                    break;
                case 1:
                    IncomingOrderDisplay.currentSwitch = Eisladen.Switches.down;
                    break;
                case 2:
                    IncomingOrderDisplay.currentSwitch = Eisladen.Switches.right;
                    break;
                default:
                    console.log("ärrör");
                    break;
            }
            console.log(Eisladen.Switches[IncomingOrderDisplay.currentSwitch]);
        }
        static async communicate(_sendURL, _actionType, _extraID) {
            _sendURL += "/" + Eisladen.ActionTypes[_actionType] + "?" + (_extraID != null ? "_id=" + _extraID : "");
            let response = await fetch(_sendURL);
            switch (_actionType) {
                case Eisladen.ActionTypes.get:
                    IncomingOrderDisplay.iterateThroughJSON(await response.json());
                    break;
            }
        }
        static iterateThroughJSON(_json) {
            for (let index = 0; index < _json.length; index++) {
                let currentOrder = _json[index];
                currentOrder.iceBalls = JSON.parse(_json[index].iceBalls);
                currentOrder.toppings = JSON.parse(_json[index].toppings);
                let newIncoming = new Eisladen.IncomingOrder(currentOrder, new Vector2D(IncomingOrderDisplay.orderStartPosition.x + index * IncomingOrderDisplay.orderXOffset, IncomingOrderDisplay.orderStartPosition.y), new Vector2D(IncomingOrderDisplay.orderStartVelocity.x, IncomingOrderDisplay.orderStartVelocity.y));
                IncomingOrderDisplay.incomingOrders.push(newIncoming);
            }
        }
        calculate() {
            IncomingOrderDisplay.orderXOffset = Eisladen.sellerCanvas.width / 8;
            IncomingOrderDisplay.beltPosition = new Vector2D(0, Eisladen.sellerCanvas.height / IncomingOrderDisplay.yOffsetPercentage);
            IncomingOrderDisplay.middleGap = 0;
            IncomingOrderDisplay.beltDimensions = new Vector2D(Eisladen.sellerCanvas.width / 2 - IncomingOrderDisplay.middleGap, Eisladen.sellerCanvas.height / 12);
            IncomingOrderDisplay.togglePoint = new Vector2D(Eisladen.sellerCanvas.width / 2, IncomingOrderDisplay.beltPosition.y + Eisladen.sellerCanvas.height / 2);
            for (let index = 0; index < IncomingOrderDisplay.incomingOrders.length; index++) {
                IncomingOrderDisplay.incomingOrders[index].calculate();
                IncomingOrderDisplay.incomingOrders[index].updateElementPosition();
            }
        }
        checkForData() {
            IncomingOrderDisplay.communicate(IncomingOrderDisplay.baseURL, Eisladen.ActionTypes.get, null);
        }
        draw() {
            this.drawBackground(-Eisladen.sellerCanvas.width, -Eisladen.sellerCanvas.height, Eisladen.sellerCanvas.width * 2, Eisladen.sellerCanvas.height * 2);
            this.drawHorizontalBelt(IncomingOrderDisplay.beltPosition, IncomingOrderDisplay.beltDimensions);
            let bp = IncomingOrderDisplay.beltPosition;
            let bd = IncomingOrderDisplay.beltDimensions;
            this.drawVerticalBelt(new Vector2D(bp.x + bd.x, bp.y), new Vector2D(bd.y, Eisladen.sellerCanvas.height / 2));
            switch (IncomingOrderDisplay.currentSwitch) {
                case Eisladen.Switches.left:
                    this.drawHorizontalBelt(new Vector2D(bp.x, bp.y + Eisladen.sellerCanvas.height / 2), new Vector2D(bd.x + bd.y, bd.y));
                    break;
                case Eisladen.Switches.down:
                    this.drawVerticalBelt(new Vector2D(bp.x + bd.x, bp.y + Eisladen.sellerCanvas.height / 2), new Vector2D(bd.y, Eisladen.sellerCanvas.height / 2));
                    break;
                case Eisladen.Switches.right:
                    this.drawHorizontalBelt(new Vector2D(bd.x, bp.y + Eisladen.sellerCanvas.height / 2), new Vector2D(bd.x, bd.y));
                    break;
                default:
                    break;
            }
        }
        drawBackground(_x, _y, _w, _h) {
            Eisladen.sellerCrc2.beginPath();
            Eisladen.sellerCrc2.strokeStyle = Eisladen.sellerBackgroundColor;
            Eisladen.sellerCrc2.fillStyle = Eisladen.sellerBackgroundColor;
            Eisladen.sellerCrc2.rect(_x, _y, _w, _h);
            Eisladen.sellerCrc2.stroke();
            Eisladen.sellerCrc2.fill();
        }
        drawHorizontalBelt(_position, _dimensions) {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = _dimensions.y / 2;
            for (let index = 0; index < this.wheelAmount; index++) {
                let yPos = _position.y + (_dimensions.y / 2);
                let xPos = _position.x + index * (this.wheelBorderRadius + this.wheelRadius * 2) - this.wheelRadius;
                if (yPos < _position.y + _dimensions.y && xPos > _position.x && xPos < _position.x + _dimensions.x) {
                    let newPos = new Vector2D(xPos, yPos);
                    let currentRotation = -Eisladen.sellerTimeSinceStart * IncomingOrderDisplay.beltSpeed;
                    this.drawWheel(newPos, this.wheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
                }
            }
        }
        drawVerticalBelt(_position, _dimensions) {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            let vWheelRadius = _dimensions.x / 2;
            for (let index = 0; index < this.wheelAmount; index++) {
                let yPos = _position.y + (index) * (vWheelRadius * 2 + this.wheelBorderRadius / 2) + vWheelRadius;
                let xPos = _position.x + vWheelRadius;
                if (yPos > _position.y + _dimensions.y) {
                    break;
                }
                let newPos = new Vector2D(xPos, yPos);
                let currentRotation = -Eisladen.sellerTimeSinceStart * IncomingOrderDisplay.beltSpeed;
                this.drawWheel(newPos, vWheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
            }
        }
        drawWheel(_position, _radius, _borderRadius, _rotation, _innerColor, _outerColor) {
            Eisladen.sellerCrc2.lineWidth = _borderRadius;
            Eisladen.sellerCrc2.beginPath();
            Eisladen.sellerCrc2.strokeStyle = _outerColor;
            Eisladen.sellerCrc2.fillStyle = _innerColor;
            Eisladen.sellerCrc2.arc(_position.x, _position.y, _radius, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.sellerCrc2.stroke();
            Eisladen.sellerCrc2.fill();
            for (let index = 0; index < this.spokeAmount; index++) {
                let currentAngle = index / this.spokeAmount * 2 * Math.PI + _rotation;
                Eisladen.sellerCrc2.beginPath();
                Eisladen.sellerCrc2.strokeStyle = "rgb(132, 132, 132)";
                Eisladen.sellerCrc2.lineWidth = this.spokeWidth;
                Eisladen.sellerCrc2.moveTo(_position.x, _position.y);
                Eisladen.sellerCrc2.lineTo(_position.x + Math.sin(currentAngle) * _radius, _position.y + Math.cos(currentAngle) * _radius);
                Eisladen.sellerCrc2.stroke();
            }
            Eisladen.sellerCrc2.lineWidth = _borderRadius / 2;
            Eisladen.sellerCrc2.beginPath();
            Eisladen.sellerCrc2.strokeStyle = _outerColor;
            Eisladen.sellerCrc2.fillStyle = _outerColor;
            Eisladen.sellerCrc2.arc(_position.x, _position.y, _radius / 5, 0 * Math.PI, 2 * Math.PI, false);
            Eisladen.sellerCrc2.stroke();
            Eisladen.sellerCrc2.fill();
        }
        drawChain(_position, _dimensions, _innerColor, _outerColor) {
            Eisladen.sellerCrc2.lineWidth = 7;
            Eisladen.sellerCrc2.beginPath();
            Eisladen.sellerCrc2.strokeStyle = _outerColor;
            Eisladen.sellerCrc2.fillStyle = _innerColor;
            Eisladen.sellerCrc2.rect(_position.x, _position.y, _dimensions.x, _dimensions.y);
            Eisladen.sellerCrc2.stroke();
            Eisladen.sellerCrc2.fill();
        }
    }
    IncomingOrderDisplay.yOffsetPercentage = 1.618 * 2;
    IncomingOrderDisplay.beltSpeed = 0.002;
    IncomingOrderDisplay.currentSwitch = Eisladen.Switches.left;
    IncomingOrderDisplay.currentSwitchNumber = 0;
    //public static baseURL: string = "http://localhost:8100";
    IncomingOrderDisplay.baseURL = "https://dercalvino.herokuapp.com";
    Eisladen.IncomingOrderDisplay = IncomingOrderDisplay;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=IncomingOrderDisplay.js.map