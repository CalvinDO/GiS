"use strict";
var Eisladen;
(function (Eisladen) {
    window.addEventListener("load", init);
    Eisladen.sellerBackgroundColor = "rgb(187, 255, 249)";
    function init(_event) {
        selectTags();
        Eisladen.currentSellerTime = Eisladen.lastFrameSellerTime = Eisladen.startSellerTime = Date.now();
        Eisladen.incomingOrderDisplay = new Eisladen.IncomingOrderDisplay();
        animate();
    }
    function selectTags() {
        Eisladen.sellerCanvas = document.querySelector("canvas");
        Eisladen.sellerCrc2 = Eisladen.sellerCanvas.getContext("2d");
        Eisladen.incomingOrderRegion = document.querySelector("#incomingOrderRegion");
    }
    function animate() {
        Eisladen.currentSellerTime = Date.now();
        Eisladen.deltaSellerTime = Eisladen.currentSellerTime - Eisladen.lastFrameSellerTime;
        Eisladen.lastFrameSellerTime = Eisladen.currentSellerTime;
        Eisladen.sellerTimeSinceStart = Eisladen.currentSellerTime - Eisladen.startSellerTime;
        Eisladen.incomingOrderDisplay.calculate();
        Eisladen.incomingOrderDisplay.draw();
        requestAnimationFrame(animate);
    }
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=Seller.js.map