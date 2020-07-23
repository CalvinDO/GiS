namespace Eisladen {
    import Vector2D = Vector.Vector2D;

    export class IncomingOrderDisplay {
        public static incomingOrders: IncomingOrder[];
        public static beltPosition: Vector2D;
        public static beltDimensions: Vector2D;

        public static yOffsetPercentage: number = 1.618 * 2;
        public static middleGap: number;

        public static orderXOffset: number;

        public static beltSpeed: number = 0.002;

        public static currentSwitch: Switches = Switches.right;
        public static currentSwitchNumber: number = 0;

        public static togglePoint: Vector2D;

        public static orderStartPosition: Vector2D;
        public static orderStartVelocity: Vector2D;

        public wheelRadius: number;
        public wheelAmount: number = 60;

        private wheelBorderRadius: number = 5;
        private spokeAmount: number = 8;
        private spokeWidth: number = 3;

        private baseURL: string = "http://localhost:8100";

        constructor() {
            IncomingOrderDisplay.beltPosition = new Vector2D(0, sellerCanvas.height / IncomingOrderDisplay.yOffsetPercentage);

            IncomingOrderDisplay.incomingOrders = [];
            let content: string = "Container: Cone <br> Gesamtpreis: 23.20€ <br><br>Chocolate: 2 <br> Vanilla: 3 <br>";
            IncomingOrderDisplay.orderStartPosition = new Vector2D(sellerCanvas.width / 20, IncomingOrderDisplay.beltPosition.y);
            IncomingOrderDisplay.orderStartVelocity = new Vector2D(IncomingOrderDisplay.beltSpeed * 100, 0);


            this.checkForData();
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
            this.communicate(this.baseURL, ActionTypes.get);
        }

        public async communicate(_sendURL: RequestInfo, _actionType: ActionTypes): Promise<void> {
            _sendURL += "/" + ActionTypes[_actionType] + "?";
            let response: Response = await fetch(_sendURL);
            //let responseText: string = await response.text();
            //IncomingOrderDisplay.incomingOrders[0].content = 
            this.iterateThroughJSON(await response.json());
            //IncomingOrderDisplay.incomingOrders[0].updateElementPosition();
        }
        public iterateThroughJSON(_json: any[]): void {
            for (let index: number = 0; index < _json.length; index++) {
                let currentOrder: Order = <Order>_json[index];
                currentOrder.iceBalls = JSON.parse(_json[index].iceBalls);
                currentOrder.toppings = JSON.parse(_json[index].toppings);

                let newIncoming: IncomingOrder = new IncomingOrder(currentOrder, new Vector2D(IncomingOrderDisplay.orderStartPosition.x + index * IncomingOrderDisplay.orderXOffset, IncomingOrderDisplay.orderStartPosition.y), new Vector2D(IncomingOrderDisplay.orderStartVelocity.x, IncomingOrderDisplay.orderStartVelocity.y));
                IncomingOrderDisplay.incomingOrders.push(newIncoming);
            }
        }
        public draw(): void {
            this.drawHorizontalBelt(IncomingOrderDisplay.beltPosition, IncomingOrderDisplay.beltDimensions);
            let bp: Vector2D = IncomingOrderDisplay.beltPosition;
            let bd: Vector2D = IncomingOrderDisplay.beltDimensions;
            this.drawVerticalBelt(new Vector2D(bp.x + bd.x, bp.y), new Vector2D(bd.y, sellerCanvas.height / 2));
            this.drawHorizontalBelt(new Vector2D(bp.x, bp.y + sellerCanvas.height / 2), new Vector2D(bd.x + bd.y, bd.y));
        }
        private drawHorizontalBelt(_position: Vector2D, _dimensions: Vector2D): void {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            this.wheelRadius = _dimensions.y / 2;

            for (let index: number = 0; index < this.wheelAmount; index++) {
                let yPos: number = _position.y + (_dimensions.y / 2);
                let xPos: number = (_position.x + _dimensions.x) - (this.wheelRadius + _position.x + index * (this.wheelRadius * 2 + this.wheelBorderRadius));
                if (yPos > _position.y + _dimensions.y || xPos < _position.x) {
                    break;
                }

                let newPos: Vector2D = new Vector2D(xPos, yPos);
                let currentRotation: number = -sellerTimeSinceStart * IncomingOrderDisplay.beltSpeed;
                this.drawWheel(newPos, this.wheelRadius, this.wheelBorderRadius, currentRotation, "rgb(204, 204, 204)", "rgb(0,0,0)");
            }
        }
        private drawVerticalBelt(_position: Vector2D, _dimensions: Vector2D): void {
            this.drawChain(_position, _dimensions, "rgb(88, 88, 88)", "rgb(0,0,0)");
            let vWheelRadius: number = _dimensions.x / 2;

            for (let index: number = 0; index < this.wheelAmount; index++) {
                let yPos: number = _position.y + (index) * (vWheelRadius * 2) + vWheelRadius;
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