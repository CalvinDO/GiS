"use strict";
var Eisladen;
(function (Eisladen) {
    var ContainerSelector = Eisladen.ContainerSelector;
    var IcePicker = Eisladen.IcePicker;
    var Vector2D = Vector.Vector2D;
    window.addEventListener("load", init);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    Eisladen.backgroundColor = "rgb(187, 255, 249)";
    let icePicker;
    let toppingPicker;
    let frameCounter = 0;
    Eisladen.gravity = new Vector2D(0, 0.1);
    Eisladen.totalPriceWithoutContainer = 0;
    let versandForm;
    let versandIsDisplayed;
    let buy;
    let submit;
    let reset;
    let totalPriceDisplay;
    function init(_event) {
        ContainerSelector.init();
        selectTags();
        //localStorage.clear();
        if (localStorage.getItem("currentIceOrder")) {
            Eisladen.iceOrder = loadIceFromLocalStorage();
            console.log(Eisladen.iceOrder);
            if (Eisladen.iceOrder.container) {
                Eisladen.localStorageIceOrderContainerReady = true;
                if (Eisladen.iceOrder.container.iceBalls) {
                    Eisladen.localStorageIceOrderIceBallsReady = true;
                }
            }
        }
        else {
            Eisladen.iceOrder = new Eisladen.IceOrder();
        }
        icePicker = new IcePicker();
        toppingPicker = new Eisladen.ToppingPicker();
        animate();
    }
    function updateLocalStorage() {
        console.log(Eisladen.iceOrder);
        localStorage.setItem("currentIceOrder", JSON.stringify(Eisladen.iceOrder));
    }
    Eisladen.updateLocalStorage = updateLocalStorage;
    function loadIceFromLocalStorage() {
        let iceJSONString = localStorage.getItem("currentIceOrder");
        let parsedIceOrder = JSON.parse(iceJSONString);
        return parsedIceOrder;
    }
    function selectTags() {
        Eisladen.canvas = document.querySelector("canvas");
        Eisladen.crc2 = Eisladen.canvas.getContext("2d");
        totalPriceDisplay = document.querySelector("#totalPriceDisplay");
        versandForm = document.querySelector("#versandinfos");
        buy = document.querySelector("#buy");
        reset = document.querySelector("#reset");
        buy.addEventListener("click", handleBuy);
        reset.addEventListener("click", handleReset);
        submit = document.querySelector("#realSubmit");
        submit.addEventListener("click", handleSubmit);
    }
    function handleBuy(_event) {
        versandIsDisplayed = true;
    }
    function handleReset(_event) {
    }
    function handleSubmit(_event) {
    }
    function handleMouseDown(_event) {
        toppingPicker.checkMouseClick(_event.clientX, _event.clientY);
        if (versandIsDisplayed) {
            let xMin = Eisladen.canvas.width / 4;
            let xMax = Eisladen.canvas.width / 4 + Eisladen.canvas.width / 2;
            let yMin = Eisladen.canvas.height / 4;
            let yMax = Eisladen.canvas.height / 4 + Eisladen.canvas.height / 2;
            if ((_event.clientX < xMin || _event.clientX > xMax) || (_event.clientY < yMin || _event.clientY > yMax)) {
                versandIsDisplayed = false;
            }
        }
    }
    function drawBackground(_x, _y, _w, _h) {
        Eisladen.crc2.beginPath();
        Eisladen.crc2.strokeStyle = Eisladen.backgroundColor;
        Eisladen.crc2.fillStyle = Eisladen.backgroundColor;
        Eisladen.crc2.rect(_x, _y, _w, _h);
        Eisladen.crc2.stroke();
        Eisladen.crc2.fill();
    }
    function drawCounterBar() {
        Eisladen.crc2.beginPath();
        Eisladen.crc2.strokeStyle = "#a0522d";
        Eisladen.crc2.lineWidth = 20;
        Eisladen.crc2.fillStyle = "#8b4513";
        Eisladen.crc2.rect(0, ContainerSelector.ballImpactPoint.y + ContainerSelector.currentTotalOffset.y, Eisladen.canvas.width, Eisladen.canvas.height);
        Eisladen.crc2.stroke();
        Eisladen.crc2.fill();
    }
    function animate() {
        frameCounter++;
        drawBackground(-Eisladen.canvas.width, -Eisladen.canvas.height, Eisladen.canvas.width * 2, Eisladen.canvas.height * 2);
        icePicker.calculate(frameCounter);
        toppingPicker.calculate(frameCounter);
        ContainerSelector.calculate(frameCounter);
        ContainerSelector.update();
        drawCounterBar();
        icePicker.draw(frameCounter);
        toppingPicker.draw();
        let roundedTotalPrice = Math.round((Eisladen.totalPriceWithoutContainer + ContainerSelector.containerPrice) * 1000) / 1000;
        totalPriceDisplay.innerHTML = roundedTotalPrice + "€";
        Eisladen.iceOrder.totalPrice = roundedTotalPrice + "€";
        Eisladen.updateLocalStorage();
        //localStorage.setItem("currentIceBalls", JSON.stringify(iceOrder.container.iceBalls));
        versandForm.setAttribute("style", versandIsDisplayed ? "display: inline-block !important" : "display: none !important");
        requestAnimationFrame(animate);
    }
    function handleKeyDown(_event) {
        let k = _event.key;
        Eisladen.upKey = k == "ArrowUp";
        Eisladen.downKey = k == "ArrowDown";
        Eisladen.rightKey = k == "ArrowRight";
        Eisladen.leftKey = k == "ArrowLeft";
        if (k == " ") {
            Eisladen.spaceKey = Eisladen.spaceKey ? false : true;
        }
    }
    function handleKeyUp(_event) {
        Eisladen.upKey = Eisladen.downKey = Eisladen.leftKey = Eisladen.rightKey = false;
    }
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=Main.js.map