namespace Eisladen {
    import Vector2D = IceVector.Vector2D;

    export class IncomingOrder {
        public element: HTMLDivElement;

        public order: Order;
        public position: Vector2D;
        public velocitiy: Vector2D;

        public toggleState: number;
        public switchState: Switches;

        public removed: boolean;

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

            let headerDiv: HTMLDivElement = document.createElement("div");
            let dataDiv: HTMLDivElement = document.createElement("div");
            headerDiv.setAttribute("id", "headerSection");
            dataDiv.setAttribute("id", "dataSection");

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

            headerDiv.append(name);
            headerDiv.append(vorname);
            headerDiv.append(adresse);

            this.element.append(headerDiv);

            dataDiv.append(price);
            dataDiv.append(container);
            dataDiv.append(iceBalls);
            dataDiv.append(toppings);

            this.element.append(dataDiv);
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
                this.switchState = IncomingOrderDisplay.currentSwitch;

                switch (this.switchState) {
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
            if (this.position.y > sellerCanvas.height && !this.removed) {
                IncomingOrderDisplay.communicate(IncomingOrderDisplay.baseURL, ActionTypes.remove, this.order._id);
                this.removed = true;
            }
        }
        public updateElementPosition(): void {
            this.element.style.left = this.position.x + "px";
            this.element.style.top = this.position.y + "px";
        }
    }
}