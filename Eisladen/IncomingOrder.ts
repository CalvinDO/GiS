namespace Eisladen {
    import Vector2D = Vector.Vector2D;

    export class IncomingOrder {
        public element: HTMLDivElement;

        public content: string;
        public position: Vector2D;
        public velocitiy: Vector2D;

        public toggleState: number;

        constructor(_content: string, _position: Vector2D, _velocity: Vector2D) {
            this.content = _content;
            this.element = document.createElement("div");
            this.element.id = "incomingOrder";
            this.element.style.display = "none !important";
            this.element.innerHTML = _content;

            this.position = _position;
            this.velocitiy = _velocity;

            this.toggleState = 0;

            incomingOrderRegion.append(this.element);
        }

        public calculate(): void {
            if (this.toggleState == 0) {
                if (this.position.x > sellerCanvas.width / 2) {
                    this.velocitiy.y = this.velocitiy.x;
                    this.velocitiy.x = 0;
                    this.toggleState = 1;
                }
            }
            if (this.position.y >= IncomingOrderDisplay.togglePoint.y && this.toggleState == 1) {
                switch (IncomingOrderDisplay.currentSwitch) {
                    case Switches.left:
                        this.velocitiy.x = - this.velocitiy.y;
                        this.velocitiy.y = 0;
                        this.toggleState = 2;
                        break;
                    case Switches.right:
                        break;
                    case Switches.down:
                        break;
                    default:
                        break;
                }
            }
            if (this.toggleState == 2) {
                if (this.position.x < 0) {
                    this.position = new Vector2D(IncomingOrderDisplay.orderStartPosition.x, IncomingOrderDisplay.orderStartPosition.y);
                    this.velocitiy = new Vector2D(IncomingOrderDisplay.orderStartVelocity.x, IncomingOrderDisplay.orderStartVelocity.y);
                    this.toggleState = 0;
                }
            }
            this.position.add(new Vector2D(this.velocitiy.x * deltaSellerTime, this.velocitiy.y * deltaSellerTime));
        }
        public updateElementPosition(): void {
            this.element.innerHTML = this.content;
            this.element.style.left = this.position.x + "px";
            this.element.style.top = this.position.y + "px";
        }
    }
}