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
    Eisladen.gravity = new Vector2D(0, 0.0005);
    Eisladen.totalPriceWithoutContainer = 0;
    let versandForm;
    let fakeFormData;
    let versandDiv;
    let versandIsDisplayed;
    let buy;
    let submit;
    let reset;
    let totalPriceDisplay;
    let totalPriceFromLocalStorage = 0;
    // let toSeller: HTMLDivElement;
    let baseURL = "http://localhost:8100";
    function init(_event) {
        Eisladen.currentTime = Eisladen.lastFrameTime = Eisladen.startTime = Date.now();
        ContainerSelector.init();
        selectTags();
        //localStorage.clear();
        generateFromLocalStorage();
        animate();
    }
    function generateFromLocalStorage() {
        if (localStorage.getItem("currentIceOrder")) {
            Eisladen.iceOrder = loadIceFromLocalStorage();
            if (Eisladen.iceOrder.container) {
                Eisladen.localStorageIceOrderContainerReady = true;
                totalPriceFromLocalStorage = +Eisladen.iceOrder.totalPrice;
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
    }
    function updateLocalStorage() {
        Eisladen.iceOrder.container.iceBalls = IcePicker.stackedBalls;
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
        versandDiv = document.querySelector("#invisibleData");
    }
    function handleBuy(_event) {
        if (!Eisladen.iceOrder.container.iceBalls) {
            return;
        }
        versandDiv.innerHTML = "";
        versandIsDisplayed = true;
        let currentContainerNameString = Eisladen.iceOrder.container.name + "";
        let currentContainerPriceString = Eisladen.iceOrder.totalPrice.toFixed(2) + "";
        let newContainerInput = document.createElement("input");
        let newPriceStringInput = document.createElement("input");
        newPriceStringInput.setAttribute("id", "priceInput");
        newContainerInput.setAttribute("name", "container");
        newPriceStringInput.setAttribute("value", currentContainerPriceString);
        newPriceStringInput.setAttribute("name", "price");
        newContainerInput.setAttribute("value", currentContainerNameString);
        let newContainerLabel = document.createElement("label");
        newContainerLabel.setAttribute("for", "container");
        newContainerLabel.innerHTML = "Container: " + "<br>";
        let priceLabel = document.createElement("label");
        priceLabel.setAttribute("for", "priceInput");
        priceLabel.innerHTML = "Price: ";
        versandDiv.append(newContainerLabel);
        versandDiv.append(newContainerInput);
        versandDiv.append(document.createElement("br"));
        versandDiv.append(priceLabel);
        versandDiv.append(document.createElement("br"));
        versandDiv.append(newPriceStringInput);
        versandDiv.append(document.createElement("br"));
        displayIceBalls();
        displayToppings();
    }
    function displayToppings() {
        Eisladen.currentToppingNames = [];
        Eisladen.currentToppingAmounts = [];
        for (let index = 0; index < Eisladen.iceOrder.container.iceBalls.length; index++) {
            for (let topIndex = 0; topIndex < Eisladen.iceOrder.container.iceBalls[index].stickingToppings.length; topIndex++) {
                Eisladen.currentToppingNames.push(Eisladen.iceOrder.container.iceBalls[index].stickingToppings[topIndex].name);
            }
        }
        for (let iceBallNameIndex = 0; iceBallNameIndex < Eisladen.currentIceBallNames.length; iceBallNameIndex++) {
            for (let topIndex = 0; topIndex < Eisladen.iceOrder.container.iceBalls[iceBallNameIndex].stickingToppings.length; topIndex++) {
                Eisladen.currentToppingAmounts.push(countNameInArray(Eisladen.currentToppingNames[topIndex], Eisladen.currentToppingNames));
            }
        }
        let alreadyDisplayed = [];
        let sortedToppingNames = [];
        let sortedToppingAmounts = [];
        for (let index = 0; index < Eisladen.currentIceBallNames.length; index++) {
            for (let topIndex = 0; topIndex < Eisladen.iceOrder.container.iceBalls[index].stickingToppings.length; topIndex++) {
                Eisladen.currentToppingNames.push(Eisladen.iceOrder.container.iceBalls[index].stickingToppings[topIndex].name);
                if (!arrayContains(Eisladen.currentToppingNames[topIndex], alreadyDisplayed)) {
                    sortedToppingNames.push(Eisladen.currentToppingNames[topIndex]);
                    sortedToppingAmounts.push(Eisladen.currentToppingAmounts[topIndex]);
                    alreadyDisplayed.push(Eisladen.currentToppingNames[topIndex]);
                }
            }
        }
        let combined = [];
        for (let sortedIndex = 0; sortedIndex < sortedToppingNames.length; sortedIndex++) {
            let currentString = sortedToppingNames[sortedIndex] + ": " + sortedToppingAmounts[sortedIndex];
            combined.push(currentString);
        }
        let toppings = document.createElement("input");
        toppings.setAttribute("name", "toppings");
        toppings.setAttribute("value", JSON.stringify(combined));
        versandDiv.append(toppings);
        versandDiv.append(document.createElement("br"));
    }
    function displayIceBalls() {
        Eisladen.currentIceBallNames = [];
        Eisladen.currentToppingAmounts = [];
        for (let index = 0; index < Eisladen.iceOrder.container.iceBalls.length; index++) {
            Eisladen.currentIceBallNames.push(Eisladen.iceOrder.container.iceBalls[index].iceSort.name);
        }
        for (let iceBallNameIndex = 0; iceBallNameIndex < Eisladen.currentIceBallNames.length; iceBallNameIndex++) {
            Eisladen.currentToppingAmounts.push(countNameInArray(Eisladen.currentIceBallNames[iceBallNameIndex], Eisladen.currentIceBallNames));
        }
        let alreadyDisplayed = [];
        let sortedIceBallNames = [];
        let sortedIceBallAmounts = [];
        for (let iceBallNameIndex = 0; iceBallNameIndex < Eisladen.currentIceBallNames.length; iceBallNameIndex++) {
            if (!arrayContains(Eisladen.currentIceBallNames[iceBallNameIndex], alreadyDisplayed)) {
                sortedIceBallNames.push(Eisladen.currentIceBallNames[iceBallNameIndex]);
                sortedIceBallAmounts.push(Eisladen.currentToppingAmounts[iceBallNameIndex]);
                alreadyDisplayed.push(Eisladen.currentIceBallNames[iceBallNameIndex]);
            }
        }
        let combined = [];
        for (let sortedIndex = 0; sortedIndex < sortedIceBallNames.length; sortedIndex++) {
            let currentString = sortedIceBallNames[sortedIndex] + ": " + sortedIceBallAmounts[sortedIndex];
            combined.push(currentString);
        }
        let iceBalls = document.createElement("input");
        iceBalls.setAttribute("name", "iceBalls");
        iceBalls.setAttribute("value", JSON.stringify(combined));
        versandDiv.append(iceBalls);
        versandDiv.append(document.createElement("br"));
    }
    function arrayContains(_name, _array) {
        for (let index = 0; index < _array.length; index++) {
            if (_name == _array[index]) {
                return true;
            }
        }
        return false;
    }
    function countNameInArray(_name, _array) {
        let result = 0;
        for (let index = 0; index < _array.length; index++) {
            if (_name == _array[index]) {
                result++;
            }
        }
        return result;
    }
    function handleReset(_event) {
        localStorage.clear();
        location.reload();
    }
    function handleSubmit(_event) {
        communicate(baseURL, Eisladen.ActionTypes.set);
        versandIsDisplayed = true;
    }
    async function communicate(_sendURL, _actionType) {
        fakeFormData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query = new URLSearchParams(fakeFormData);
        _sendURL += "/";
        _sendURL += Eisladen.ActionTypes[_actionType];
        _sendURL += "?" + query.toString();
        let response = await fetch(_sendURL);
        let responseText = await response.text();
    }
    function handleMouseDown(_event) {
        toppingPicker.checkMouseClick(_event.clientX, _event.clientY);
        /*
        if (versandIsDisplayed) {
            let xMin: number = canvas.width / 4;
            let xMax: number = canvas.width / 4 + canvas.width / 2;
            let yMin: number = canvas.height / 4;
            let yMax: number = canvas.height / 4 + canvas.height / 2;
            if ((_event.clientX < xMin || _event.clientX > xMax) || (_event.clientY < yMin || _event.clientY > yMax)) {
                versandIsDisplayed = false;
            }
        }
        */
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
        Eisladen.currentTime = Date.now();
        Eisladen.deltaTime = Eisladen.currentTime - Eisladen.lastFrameTime;
        Eisladen.lastFrameTime = Eisladen.currentTime;
        Eisladen.timeSinceStart = Eisladen.currentTime - Eisladen.startTime;
        drawBackground(-Eisladen.canvas.width, -Eisladen.canvas.height, Eisladen.canvas.width * 2, Eisladen.canvas.height * 2);
        icePicker.calculate(frameCounter);
        toppingPicker.calculate(frameCounter);
        ContainerSelector.calculate(frameCounter);
        ContainerSelector.update();
        drawCounterBar();
        icePicker.draw(frameCounter);
        toppingPicker.draw();
        let roundedTotalPrice = Math.round((Eisladen.totalPriceWithoutContainer + ContainerSelector.containerPrice) * 1000) / 1000;
        Eisladen.iceOrder.totalPrice = roundedTotalPrice + totalPriceFromLocalStorage;
        totalPriceDisplay.innerHTML = Eisladen.iceOrder.totalPrice.toFixed(2) + "€";
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