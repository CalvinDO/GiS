namespace Eisladen {
    import Vector2D = Vector.Vector2D;

    export class IncomingOrder {
        public element: HTMLDivElement;

        public order: Order;
        public position: Vector2D;
        public velocitiy: Vector2D;

        public toggleState: number;

        constructor(_order: Order, _position: Vector2D, _velocity: Vector2D) {
            this.order = _order;
            this.element = document.createElement("div");
            this.element.id = "incomingOrder";

            this.generateTags(_order);

            this.position = _position;
            this.velocitiy = _velocity;

            this.toggleState = 0;

            incomingOrderRegion.append(this.element);
        }
        public generateTags(_order: Order): void {
            let name: HTMLHeadingElement = document.createElement("h2");
            let vorname: HTMLHeadingElement = document.createElement("h2");
            let adresse: HTMLHeadingElement = document.createElement("h2");

            name.innerHTML = _order.name;
            vorname.innerHTML = _order.vorname;
            adresse.innerHTML = _order.adresse;

            let price: HTMLParagraphElement = document.createElement("p");
            price.innerHTML = _order.price + "€";

            let container: HTMLParagraphElement = document.createElement("p");
            container.innerHTML = _order.container;
            let iceBalls: HTMLDivElement = document.createElement("div");

            for (let index: number = 0; index < _order.iceBalls.length; index++) {
                let ball: HTMLParagraphElement = document.createElement("p");
                ball.innerHTML = _order.iceBalls[index];
                iceBalls.append(ball);
            }
            let toppings: HTMLDivElement = document.createElement("div");
            for (let index: number = 0; index < _order.toppings.length; index++) {
                let topping: HTMLParagraphElement = document.createElement("p");
                topping.innerHTML = _order.toppings[index];
                toppings.append(topping);
            }

            this.element.append(name);
            this.element.append(vorname);
            this.element.append(adresse);
            this.element.append(price);
            this.element.append(container);
            this.element.append(iceBalls);
            this.element.append(toppings);
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
                        this.velocitiy.x = this.velocitiy.y;
                        this.velocitiy.y = 0;
                        this.toggleState = 2;
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
            this.element.style.left = this.position.x + "px";
            this.element.style.top = this.position.y + "px";
        }
    }
}