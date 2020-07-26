namespace Eisladen {
    import Vector2D = IceVector.Vector2D;

    export class ContainerSelector {
        public static goldenRatio: number = 1.6180339;
        public static containers: Container[];

        public static buttonLeft: HTMLImageElement;
        public static buttonRight: HTMLImageElement;

        public static currentSelectedContainer: number;

        public static containerSelection: HTMLElement;

        public static containerWidthPercentage: number = 5;
        public static startContainerSelectionLeft: number;
        public static containerWidth: number;

        public static currentFrame: number;

        public static goalAbsolutePercentage: number;
        public static currentAbsolutePercentage: number;
        public static differenceAbsolutePercantage: number;

        public static accel: number = 0.075;
        public static factor: number;

        public static ballImpactPoint: Vector2D;
        public static offsetPerBall: Vector2D;
        public static currentTotalOffset: Vector2D = new Vector2D(0, 0);

        public static containerPrice: number = 0;

        public static init(): void {
            ContainerSelector.buttonRight = <HTMLImageElement>document.querySelector("#right");
            ContainerSelector.buttonLeft = <HTMLImageElement>document.querySelector("#left");

            ContainerSelector.buttonRight.addEventListener("click", ContainerSelector.handleContainerSelect.bind(ContainerSelector.buttonRight));
            ContainerSelector.buttonLeft.addEventListener("click", ContainerSelector.handleContainerSelect.bind(ContainerSelector.buttonLeft));

            ContainerSelector.containerSelection = <HTMLElement>document.querySelector("#container-selection");

            ContainerSelector.loadContainersFromJSON("json/containersData.json");
            ContainerSelector.containerSelection.setAttribute("style", "left: " + ContainerSelector.startContainerSelectionLeft);
        }

        public static async loadContainersFromJSON(_url: RequestInfo): Promise<void> {
            let response: Response = await fetch(_url);
            ContainerSelector.containers = <Container[]>await response.json();
            this.loadContainers(ContainerSelector.containers);
            ContainerSelector.containerPrice = ContainerSelector.containers[ContainerSelector.currentSelectedContainer].price;
            ContainerSelector.containers[ContainerSelector.currentSelectedContainer].iceBalls = Eisladen.iceOrder.container.iceBalls;
        }

        public static loadContainers(_containers: Container[]): void {
            ContainerSelector.currentSelectedContainer = Math.round(_containers.length / 2) - 1;

            if (Eisladen.localStorageIceOrderContainerReady) {
                ContainerSelector.currentSelectedContainer = +iceOrder.container.id;
                ContainerSelector.startContainerSelectionLeft = (50) - (ContainerSelector.containerWidthPercentage * (ContainerSelector.currentSelectedContainer) + ContainerSelector.containerWidthPercentage / 2);

            } else {
                ContainerSelector.startContainerSelectionLeft = (50) - (ContainerSelector.containerWidthPercentage * (_containers.length) / 2);
                iceOrder.container = ContainerSelector.containers[ContainerSelector.currentSelectedContainer];
            }
            ContainerSelector.goalAbsolutePercentage = ContainerSelector.currentAbsolutePercentage = ContainerSelector.startContainerSelectionLeft;
            for (let index: number = 0; index < _containers.length; index++) {
                let currentDiv: HTMLDivElement = document.createElement("div");
                currentDiv.setAttribute("class", "ice-display");
                if (index == (_containers.length - 1) / 2) {
                    currentDiv.setAttribute("id", "middle");
                } else {
                    currentDiv.setAttribute("id", "small");
                }
                let currentImage: HTMLImageElement = document.createElement("img");
                currentImage.setAttribute("src", _containers[index].image);
                currentDiv.append(currentImage);
                let currentName: HTMLHeadingElement = document.createElement("h2");
                currentName.innerHTML = _containers[index].name;
                currentName.setAttribute("class", "containerPriceDisplay");
                currentDiv.append(currentName);
                let currentPrice: HTMLParagraphElement = document.createElement("p");
                currentPrice.innerHTML = _containers[index].price + " €";
                currentPrice.setAttribute("class", "containerPriceDisplay");
                currentDiv.append(currentPrice);

                this.containerSelection.append(currentDiv);
            }
        }

        public static handleContainerSelect(this: HTMLImageElement, _event: Event): void {
            ContainerSelector.currentSelectedContainer += this.id == "right" ? 1 : -1;
            ContainerSelector.currentSelectedContainer += ContainerSelector.currentSelectedContainer > (ContainerSelector.containers.length - 1) ? -1 : ContainerSelector.currentSelectedContainer < 0 ? 1 : 0;
            ContainerSelector.moveContainerSelectionTo(ContainerSelector.currentSelectedContainer);
            Eisladen.iceOrder.container = ContainerSelector.containers[ContainerSelector.currentSelectedContainer];
            ContainerSelector.containerPrice = ContainerSelector.containers[ContainerSelector.currentSelectedContainer].price;
        }
        public static moveContainerSelectionTo(_value: number): void {
            let offsetPercentage: number = 50 - (Math.round(_value) * ContainerSelector.containerWidthPercentage + ContainerSelector.containerWidthPercentage / 2);
            ContainerSelector.goalAbsolutePercentage = offsetPercentage;
        }
        public static iterateThroughContainerSelections(): void {
            for (let index: number = 0; index < ContainerSelector.containerSelection.children.length; index++) {
                let currentDiv: HTMLDivElement = <HTMLDivElement>ContainerSelector.containerSelection.children[index];

                currentDiv.setAttribute("id", ContainerSelector.currentSelectedContainer != index ? "small" : "middle");
            }
        }

        public static calculate(_currentFrame: number): void {
            ContainerSelector.currentFrame = _currentFrame;

            ContainerSelector.differenceAbsolutePercantage = ContainerSelector.goalAbsolutePercentage - ContainerSelector.currentAbsolutePercentage;
            let differenceFraction: number = ContainerSelector.differenceAbsolutePercantage * ContainerSelector.accel;
            ContainerSelector.factor = ContainerSelector.currentAbsolutePercentage / ContainerSelector.goalAbsolutePercentage;
            ContainerSelector.currentAbsolutePercentage += differenceFraction;

            ContainerSelector.containerWidth = (0.01 * ContainerSelector.containerWidthPercentage) * canvas.width;
            let ballImpactPointX: number;
            if (IcePicker.stackedBalls.length > 0) {
                ballImpactPointX = IcePicker.stackedBalls[IcePicker.stackedBalls.length - 1].position.x;
            } else {
                ballImpactPointX = canvas.width / 2;
            }
            ContainerSelector.ballImpactPoint = new Vector2D(ballImpactPointX, canvas.height / ContainerSelector.goldenRatio + IcePicker.shovelRadius);

            ContainerSelector.offsetPerBall = new Vector2D(0, IcePicker.shovelRadius / 1.5);
        }
        public static update(): void {
            let iceBallLength: number = IcePicker.stackedBalls.length;
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
}