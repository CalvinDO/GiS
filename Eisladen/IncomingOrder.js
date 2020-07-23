"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class IncomingOrder {
        constructor(_content, _position, _velocity) {
            this.content = _content;
            this.element = document.createElement("div");
            this.element.id = "incomingOrder";
            this.element.style.display = "none !important";
            this.element.innerHTML = _content;
            this.position = _position;
            this.velocitiy = _velocity;
            this.toggleState = 0;
            Eisladen.incomingOrderRegion.append(this.element);
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
                switch (Eisladen.IncomingOrderDisplay.currentSwitch) {
                    case Eisladen.Switches.left:
                        this.velocitiy.x = -this.velocitiy.y;
                        this.velocitiy.y = 0;
                        this.toggleState = 2;
                        break;
                    case Eisladen.Switches.right:
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
        }
        updateElementPosition() {
            this.element.innerHTML = this.content;
            this.element.style.left = this.position.x + "px";
            this.element.style.top = this.position.y + "px";
        }
    }
    Eisladen.IncomingOrder = IncomingOrder;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=IncomingOrder.js.map