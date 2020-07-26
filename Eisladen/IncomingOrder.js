"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = IceVector.Vector2D;
    class IncomingOrder {
        constructor(_order, _position, _velocity) {
            this.order = _order;
            this.element = document.createElement("div");
            this.element.id = "incomingOrder";
            this.generateTags(_order);
            this.position = _position;
            this.velocitiy = _velocity;
            this.toggleState = 0;
            Eisladen.incomingOrderRegion.append(this.element);
        }
        generateTags(_order) {
            let name = document.createElement("h2");
            let vorname = document.createElement("h2");
            let adresse = document.createElement("h2");
            let headerDiv = document.createElement("div");
            let dataDiv = document.createElement("div");
            headerDiv.setAttribute("id", "headerSection");
            dataDiv.setAttribute("id", "dataSection");
            name.innerHTML = _order.name;
            vorname.innerHTML = _order.vorname;
            adresse.innerHTML = _order.adresse;
            let price = document.createElement("p");
            price.innerHTML = _order.price + "€";
            let container = document.createElement("p");
            container.innerHTML = _order.container;
            let iceBalls = document.createElement("div");
            for (let index = 0; index < _order.iceBalls.length; index++) {
                let ball = document.createElement("p");
                ball.innerHTML = _order.iceBalls[index];
                iceBalls.append(ball);
            }
            let toppings = document.createElement("div");
            for (let index = 0; index < _order.toppings.length; index++) {
                let topping = document.createElement("p");
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
        calculate() {
            if (this.toggleState == 0) {
                if (this.position.x > Eisladen.sellerCanvas.width / 2) {
                    this.velocitiy.y = this.velocitiy.x;
                    this.velocitiy.x = 0;
                    this.toggleState = 1;
                }
            }
            if (this.position.y >= Eisladen.IncomingOrderDisplay.togglePoint.y && this.toggleState == 1) {
                this.switchState = Eisladen.IncomingOrderDisplay.currentSwitch;
                switch (this.switchState) {
                    case Eisladen.Switches.left:
                        this.velocitiy.x = -this.velocitiy.y;
                        this.velocitiy.y = 0;
                        this.toggleState = 2;
                        break;
                    case Eisladen.Switches.right:
                        this.velocitiy.x = this.velocitiy.y;
                        this.velocitiy.y = 0;
                        this.toggleState = 2;
                        break;
                    case Eisladen.Switches.down:
                        break;
                    default:
                        break;
                }
            }
            if (this.toggleState == 2) {
                if (this.position.x < 0) {
                    this.position = new Vector2D(Eisladen.IncomingOrderDisplay.orderStartPosition.x, Eisladen.IncomingOrderDisplay.orderStartPosition.y);
                    this.velocitiy = new Vector2D(Eisladen.IncomingOrderDisplay.orderStartVelocity.x, Eisladen.IncomingOrderDisplay.orderStartVelocity.y);
                    this.toggleState = 0;
                }
            }
            this.position.add(new Vector2D(this.velocitiy.x * Eisladen.deltaSellerTime, this.velocitiy.y * Eisladen.deltaSellerTime));
            if (this.position.y > Eisladen.sellerCanvas.height && !this.removed) {
                Eisladen.IncomingOrderDisplay.communicate(Eisladen.IncomingOrderDisplay.baseURL, Eisladen.ActionTypes.remove, this.order._id);
                this.removed = true;
            }
        }
        updateElementPosition() {
            this.element.style.left = this.position.x + "px";
            this.element.style.top = this.position.y + "px";
        }
    }
    Eisladen.IncomingOrder = IncomingOrder;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=IncomingOrder.js.map