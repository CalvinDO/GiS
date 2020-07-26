namespace Eisladen {
    import Vector2D = IceVector.Vector2D;

    export class IncomingOrderDisplay {
        public static incomingOrders: IncomingOrder[];
        public static beltPosition: Vector2D;
        public static beltDimensions: Vector2D;

        public static yOffsetPercentage: number = 1.618 * 2;
        public static middleGap: number;

        public static orderXOffset: number;

        public static beltSpeed: number = 0.002;

        public static buttonLeft: HTMLImageElement;
        public static buttonRight: HTMLImageElement;


        public static currentSwitch: Switches = Switches.left;
        public static currentSwitchNumber: number = 0;

        public static togglePoint: Vector2D;

        public static orderStartPosition: Vector2D;
        public static orderStartVelocity: Vector2D;


       //public static baseURL: string = "http://localhost:8100";
        public static baseURL: string = "https://dercalvino.herokuapp.com";

        public wheelRadius: number;
        public wheelAmount: number = 60;

        private wheelBorderRadius: number = 5;
        private spokeAmount: number = 8;
        private spokeWidth: number = 3;

        constructor() {
            IncomingOrderDisplay.beltPosition = new Vector2D(0, sellerCanvas.height / IncomingOrderDisplay.yOffsetPercentage);

            IncomingOrderDisplay.incomingOrders = [];
            IncomingOrderDisplay.orderStartPosition = new Vector2D(sellerCanvas.width / 20, IncomingOrderDisplay.beltPosition.y);
            IncomingOrderDisplay.orderStartVelocity = new Vector2D(IncomingOrderDisplay.beltSpeed * 100, 0);

            IncomingOrderDisplay.buttonLeft = <HTMLImageElement>document.querySelector("#switchLeft");
            IncomingOrderDisplay.buttonRight = <HTMLImageElement>document.querySelector("#switchRight");

            console.log(IncomingOrderDisplay.buttonRight);

            IncomingOrderDisplay.buttonLeft.addEventListener("click", IncomingOrderDisplay.handleSwitchLeft);
            IncomingOrderDisplay.buttonRight.addEventListener("click", IncomingOrderDisplay.handleSwitchRight);
            this.checkForData();
        }

        public static handleSwitchRight(_event: Event): void {
            IncomingOrderDisplay.currentSwitchNumber += IncomingOrderDisplay.currentSwitchNumber < 2 ? 1 : 0;
            IncomingOrderDisplay.toggleSwitchState(IncomingOrderDisplay.currentSwitchNumber);
        }
        public static handleSwitchLeft(_event: Event): void {
            IncomingOrderDisplay.currentSwitchNumber -= IncomingOrderDisplay.currentSwitchNumber > 0 ? 1 : 0;
            IncomingOrderDisplay.toggleSwitchState(IncomingOrderDisplay.currentSwitchNumber);
        }
        public static toggleSwitchState(_value: number): void {
            switch (_value) {
                case 0:
                    IncomingOrderDisplay.currentSwitch = Switches.left;
                    break;
                case 1:
                    IncomingOrderDisplay.currentSwitch = Switches.down;
                    break;
                case 2:
                    IncomingOrderDisplay.currentSwitch = Switches.right;
                    break;
                default:
                    console.log("ärrör");
                    break;
            }

            console.log(Switches[IncomingOrderDisplay.currentSwitch]);
        }


        public static async communicate(_sendURL: RequestInfo, _actionType: ActionTypes, _extraID: string | null): Promise<void> {
            _sendURL += "/" + ActionTypes[_actionType] + "?" + (_extraID != null ? "_id=" + _extraID : "");
            let response: Response = await fetch(_sendURL);
            console.log(response.text())
            switch (_actionType) {
                case ActionTypes.get:
                    IncomingOrderDisplay.iterateThroughJSON(await response.json());
                    break;
            }
        }
        public static iterateThroughJSON(_json: any[]): void {
            for (let index: number = 0; index < _json.length; index++) {
                let currentOrder: Order = <Order>_json[index];
                currentOrder.iceBalls = JSON.parse(_json[index].iceBalls);
                currentOrder.toppings = JSON.parse(_json[index].toppings);

                let newIncoming: IncomingOrder = new IncomingOrder(currentOrder, new Vector2D(IncomingOrderDisplay.orderStartPosition.x + index * IncomingOrderDisplay.orderXOffset, IncomingOrderDisplay.orderStartPosition.y), new Vector2D(IncomingOrderDisplay.orderStartVelocity.x, IncomingOrderDisplay.orderStartVelocity.y));
                IncomingOrderDisplay.incomingOrders.push(newIncoming);
            }
        }
        public calculate(): void {
            IncomingOrderDisplay.orderXOffset = sellerCanvas.width / 8;
            IncomingOrderDisplay.beltPosition = new Vector2D(0, sellerCanvas.height / IncomingOrderDisplay.yOffsetPercentage);
            IncomingOrderDisplay.middleGap = 0;
            IncomingOrderDisplay.beltDimensions = new Vector2D(sellerCanvas.width / 2 - IncomingOrderDisplay.middleGap, sellerCanvas.height / 12);

            IncomingOrderDisplay.togglePoint = new Vector2D(sellerCanvas.width / 2, IncomingOrderDisplay.beltPosition.y + sellerCanvas.height / 2)
            for (let index: number = 0; index < IncomingOrderDisplay.incomingOrders.length; index++) {
                IncomingOrderDisplay.incomingOrders[index].calculate();
                IncomingOrderDisplay.incomingOrders[index].updateElementPosition();
            }
        }
        public checkForData(): void {
            IncomingOrderDisplay.communicate(IncomingOrderDisplay.baseURL, ActionTypes.get, null);
        }

        public draw(): void {
            this.drawBackground(-sellerCanvas.width, -sellerCanvas.height, sellerCanvas.width * 2, sellerCanvas.height * 2);
            this.drawHorizontalBelt(IncomingOrderDisplay.beltPosition, IncomingOrderDisplay.beltDimensions);
            let bp: Vector2D = IncomingOrderDisplay.beltPosition;
            let bd: Vector2D = IncomingOrderDisplay.beltDimensions;
            this.drawVerticalBelt(new Vector2D(bp.x + bd.x, bp.y), new Vector2D(bd.y, sellerCanvas.height / 2));
            switch (IncomingOrderDisplay.currentSwitch) {
                case Switches.left:
                    this.drawHorizontalBelt(new Vector2D(bp.x, bp.y + sellerCanvas.height / 2), new Vector2D(bd.x + bd.y, bd.y));
                    break;
                case Switches.down:
                    this.drawVerticalBelt(new Vector2D(bp.x + bd.x, bp.y + sellerCanvas.height / 2), new Vector2D(bd.y, sellerCanvas.height / 2));
                    break;
                case Switches.right:
                    this.drawHorizontalBelt(new Vector2D(bd.x, bp.y + sellerCanvas.height / 2), new Vector2D(bd.x, bd.y));
                    break;
                default:
                    break;
            }
        }
        private drawBackground(_x: number, _y: number, _w: number, _h: number): void {
            sellerCrc2.beginPath();
            sellerCrc2.strokeStyle = sellerBackgroundColor;
            sellerCrc2.fillStyle = sellerBackgroundColor;
            sellerCrc2.rect(_x, _y, _w, _h);
            sellerCrc2.stroke();
            sellerCrc2.fill();
        }

        private drawHorizontalBelt(_position: Vector2D, _dimensions: Vector2D): void {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = _dimensions.y / 2;

            for (let index: number = 0; index < this.wheelAmount; index++) {
                let yPos: number = _position.y + (_dimensions.y / 2);
                let xPos: number = _position.x + index * (this.wheelBorderRadius + this.wheelRadius * 2) - this.wheelRadius;
                if (yPos < _position.y + _dimensions.y && xPos > _position.x && xPos < _position.x + _dimensions.x) {
                    let newPos: Vector2D = new Vector2D(xPos, yPos);
                    let currentRotation: number = -sellerTimeSinceStart * IncomingOrderDisplay.beltSpeed;
                    this.drawWheel(newPos, this.wheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
                }
            }
        }
        private drawVerticalBelt(_position: Vector2D, _dimensions: Vector2D): void {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            let vWheelRadius: number = _dimensions.x / 2;

            for (let index: number = 0; index < this.wheelAmount; index++) {
                let yPos: number = _position.y + (index) * (vWheelRadius * 2 + this.wheelBorderRadius / 2) + vWheelRadius;
                let xPos: number = _position.x + vWheelRadius;

                if (yPos > _position.y + _dimensions.y) {
                    break;
                }
                let newPos: Vector2D = new Vector2D(xPos, yPos);
                let currentRotation: number = -sellerTimeSinceStart * IncomingOrderDisplay.beltSpeed;
                this.drawWheel(newPos, vWheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
            }
        }
        private drawWheel(_position: Vector2D, _radius: number, _borderRadius: number, _rotation: number, _innerColor: string, _outerColor: string): void {
            sellerCrc2.lineWidth = _borderRadius;

            sellerCrc2.beginPath();
            sellerCrc2.strokeStyle = _outerColor;
            sellerCrc2.fillStyle = _innerColor;
            sellerCrc2.arc(_position.x, _position.y, _radius, 0 * Math.PI, 2 * Math.PI, false);
            sellerCrc2.stroke();
            sellerCrc2.fill();
            for (let index: number = 0; index < this.spokeAmount; index++) {
                let currentAngle: number = index / this.spokeAmount * 2 * Math.PI + _rotation;

                sellerCrc2.beginPath();
                sellerCrc2.strokeStyle = "rgb(132, 132, 132)";
                sellerCrc2.lineWidth = this.spokeWidth;
                sellerCrc2.moveTo(_position.x, _position.y);
                sellerCrc2.lineTo(_position.x + Math.sin(currentAngle) * _radius, _position.y + Math.cos(currentAngle) * _radius);
                sellerCrc2.stroke();
            }
            sellerCrc2.lineWidth = _borderRadius / 2;
            sellerCrc2.beginPath();
            sellerCrc2.strokeStyle = _outerColor;
            sellerCrc2.fillStyle = _outerColor;
            sellerCrc2.arc(_position.x, _position.y, _radius / 5, 0 * Math.PI, 2 * Math.PI, false);
            sellerCrc2.stroke();
            sellerCrc2.fill();
        }
        private drawChain(_position: Vector2D, _dimensions: Vector2D, _innerColor: string, _outerColor: string): void {
            sellerCrc2.lineWidth = 7;
            sellerCrc2.beginPath();
            sellerCrc2.strokeStyle = _outerColor;
            sellerCrc2.fillStyle = _innerColor;
            sellerCrc2.rect(_position.x, _position.y, _dimensions.x, _dimensions.y);
            sellerCrc2.stroke();
            sellerCrc2.fill();
        }
    }
}