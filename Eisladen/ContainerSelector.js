"use strict";
var Eisladen;
(function (Eisladen) {
    var Vector2D = Vector.Vector2D;
    class ContainerSelector {
        static init() {
            ContainerSelector.buttonRight = document.querySelector("#right");
            ContainerSelector.buttonLeft = document.querySelector("#left");
            ContainerSelector.buttonRight.addEventListener("click", ContainerSelector.handleContainerSelect.bind(ContainerSelector.buttonRight));
            ContainerSelector.buttonLeft.addEventListener("click", ContainerSelector.handleContainerSelect.bind(ContainerSelector.buttonLeft));
            ContainerSelector.containerSelection = document.querySelector("#container-selection");
            ContainerSelector.loadContainersFromJSON("json/containersData.json");
            ContainerSelector.containerSelection.setAttribute("style", "left: " + ContainerSelector.startContainerSelectionLeft);
        }
        static async loadContainersFromJSON(_url) {
            let response = await fetch(_url);
            ContainerSelector.containers = await response.json();
            this.loadContainers(ContainerSelector.containers);
            ContainerSelector.containerPrice = ContainerSelector.containers[ContainerSelector.currentSelectedContainer].price;
            ContainerSelector.containers[ContainerSelector.currentSelectedContainer].iceBalls = Eisladen.iceOrder.container.iceBalls;
        }
        static loadContainers(_containers) {
            ContainerSelector.currentSelectedContainer = Math.round(_containers.length / 2) - 1;
            if (Eisladen.localStorageIceOrderContainerReady) {
                ContainerSelector.currentSelectedContainer = +Eisladen.iceOrder.container.id;
                ContainerSelector.startContainerSelectionLeft = (50) - (ContainerSelector.containerWidthPercentage * (ContainerSelector.currentSelectedContainer) + ContainerSelector.containerWidthPercentage / 2);
            }
            else {
                ContainerSelector.startContainerSelectionLeft = (50) - (ContainerSelector.containerWidthPercentage * (_containers.length) / 2);
                Eisladen.iceOrder.container = ContainerSelector.containers[ContainerSelector.currentSelectedContainer];
            }
            ContainerSelector.goalAbsolutePercentage = ContainerSelector.currentAbsolutePercentage = ContainerSelector.startContainerSelectionLeft;
            for (let index = 0; index < _containers.length; index++) {
                let currentDiv = document.createElement("div");
                currentDiv.setAttribute("class", "ice-display");
                if (index == (_containers.length - 1) / 2) {
                    currentDiv.setAttribute("id", "middle");
                }
                else {
                    currentDiv.setAttribute("id", "small");
                }
                let currentImage = document.createElement("img");
                currentImage.setAttribute("src", _containers[index].image);
                currentDiv.append(currentImage);
                let currentName = document.createElement("h2");
                currentName.innerHTML = _containers[index].name;
                currentName.setAttribute("class", "containerPriceDisplay");
                currentDiv.append(currentName);
                let currentPrice = document.createElement("p");
                currentPrice.innerHTML = _containers[index].price + " €";
                currentPrice.setAttribute("class", "containerPriceDisplay");
                currentDiv.append(currentPrice);
                this.containerSelection.append(currentDiv);
            }
        }
        static handleContainerSelect(_event) {
            ContainerSelector.currentSelectedContainer += this.id == "right" ? 1 : -1;
            ContainerSelector.currentSelectedContainer += ContainerSelector.currentSelectedContainer > (ContainerSelector.containers.length - 1) ? -1 : ContainerSelector.currentSelectedContainer < 0 ? 1 : 0;
            ContainerSelector.moveContainerSelectionTo(ContainerSelector.currentSelectedContainer);
            Eisladen.iceOrder.container = ContainerSelector.containers[ContainerSelector.currentSelectedContainer];
            console.log(ContainerSelector.currentSelectedContainer);
            ContainerSelector.containerPrice = ContainerSelector.containers[ContainerSelector.currentSelectedContainer].price;
        }
        static moveContainerSelectionTo(_value) {
            let offsetPercentage = 50 - (Math.round(_value) * ContainerSelector.containerWidthPercentage);
            ContainerSelector.goalAbsolutePercentage = offsetPercentage;
        }
        static iterateThroughContainerSelections() {
            for (let index = 0; index < ContainerSelector.containerSelection.children.length; index++) {
                let currentDiv = ContainerSelector.containerSelection.children[index];
                currentDiv.setAttribute("id", ContainerSelector.currentSelectedContainer != index ? "small" : "middle");
            }
        }
        static calculate(_currentFrame) {
            ContainerSelector.currentFrame = _currentFrame;
            ContainerSelector.differenceAbsolutePercantage = ContainerSelector.goalAbsolutePercentage - ContainerSelector.currentAbsolutePercentage;
            let differenceFraction = ContainerSelector.differenceAbsolutePercantage * ContainerSelector.accel;
            ContainerSelector.factor = ContainerSelector.currentAbsolutePercentage / ContainerSelector.goalAbsolutePercentage;
            ContainerSelector.currentAbsolutePercentage += differenceFraction;
            ContainerSelector.containerWidth = (0.01 * ContainerSelector.containerWidthPercentage) * Eisladen.canvas.width;
            let ballImpactPointX;
            if (Eisladen.IcePicker.stackedBalls.length > 0) {
                ballImpactPointX = Eisladen.IcePicker.stackedBalls[Eisladen.IcePicker.stackedBalls.length - 1].position.x;
            }
            else {
                ballImpactPointX = Eisladen.canvas.width / 2;
            }
            ContainerSelector.ballImpactPoint = new Vector2D(ballImpactPointX, Eisladen.canvas.height / ContainerSelector.goldenRatio + Eisladen.IcePicker.shovelRadius);
            ContainerSelector.offsetPerBall = new Vector2D(0, Eisladen.IcePicker.shovelRadius / 1.5);
        }
        static update() {
            let iceBallLength = Eisladen.IcePicker.stackedBalls.length;
            if (Eisladen.localStorageIceOrderIceBallsReady) {
                if (Eisladen.iceOrder.container.iceBalls) {
                    iceBallLength = Eisladen.iceOrder.container.iceBalls.length;
                }
            }
            ContainerSelector.currentTotalOffset = new Vector2D(0, ContainerSelector.offsetPerBall.y * iceBallLength);
            ContainerSelector.containerSelection.setAttribute("style", "top: " + ContainerSelector.currentTotalOffset.y + "px; left: " + ContainerSelector.currentAbsolutePercentage + "%");
            ContainerSelector.iterateThroughContainerSelections();
        }
    }
    ContainerSelector.goldenRatio = 1.6180339;
    ContainerSelector.containerWidthPercentage = 5;
    ContainerSelector.accel = 0.075;
    ContainerSelector.currentTotalOffset = new Vector2D(0, 0);
    ContainerSelector.containerPrice = 0;
    Eisladen.ContainerSelector = ContainerSelector;
})(Eisladen || (Eisladen = {}));
//# sourceMappingURL=ContainerSelector.js.map