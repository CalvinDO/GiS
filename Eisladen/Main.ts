namespace Eisladen {
    import ContainerSelector = Eisladen.ContainerSelector;
    import IcePicker = Eisladen.IcePicker;
    import Vector2D = Vector.Vector2D;

    window.addEventListener("load", init);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);


    export interface IceSort {
        name: string;
        price: number;
        color: string;
    }

    export interface ShippingInformation {
        surname: string;
        firstname: string;
        adress: string;
    }

    export let canvas: HTMLCanvasElement;
    export let crc2: CanvasRenderingContext2D;

    export let backgroundColor: string = "rgb(187, 255, 249)";

    let icePicker: IcePicker;
    let toppingPicker: ToppingPicker;

    let frameCounter: number = 0;

    export let rightKey: boolean;
    export let leftKey: boolean;
    export let upKey: boolean;
    export let downKey: boolean;
    export let spaceKey: boolean;

    export let gravity: Vector2D = new Vector2D(0, 0.0005);

    export let iceOrder: IceOrder;

    export let totalPriceWithoutContainer: number = 0;
    let versandForm: HTMLFormElement;
    let fakeFormData: FormData;

    let versandDiv: HTMLDivElement;

    let versandIsDisplayed: boolean;

    let buy: HTMLDivElement;
    let submit: HTMLInputElement;

    let reset: HTMLDivElement;

    let totalPriceDisplay: HTMLParagraphElement;
    let totalPriceFromLocalStorage: number = 0;

    export let localStorageIceOrderContainerReady: boolean;
    export let localStorageIceOrderIceBallsReady: boolean;


    export let currentTime: number;
    export let lastFrameTime: number;
    export let deltaTime: number;

    export let startTime: number;
    export let timeSinceStart: number;


    export let currentIceBallNames: string[];
    export let currentIceBallAmounts: number[];

    export let currentToppingNames: string[];
    export let currentToppingAmounts: number[];


    // let toSeller: HTMLDivElement;

    let baseURL: string = "http://localhost:8100";

    function init(_event: Event): void {
        currentTime = lastFrameTime = startTime = Date.now();

        ContainerSelector.init();
        selectTags();

        //localStorage.clear();

        generateFromLocalStorage();

        animate();
    }

    function generateFromLocalStorage(): void {
        if (localStorage.getItem("currentIceOrder")) {
            iceOrder = loadIceFromLocalStorage();
            if (iceOrder.container) {
                localStorageIceOrderContainerReady = true;
                totalPriceFromLocalStorage = +iceOrder.totalPrice;
                if (iceOrder.container.iceBalls) {
                    localStorageIceOrderIceBallsReady = true;
                }
            }
        } else {
            iceOrder = new IceOrder();
        }

        icePicker = new IcePicker();
        toppingPicker = new ToppingPicker();
    }
    export function updateLocalStorage(): void {
        Eisladen.iceOrder.container.iceBalls = IcePicker.stackedBalls;

        localStorage.setItem("currentIceOrder", JSON.stringify(Eisladen.iceOrder));
    }
    function loadIceFromLocalStorage(): IceOrder {
        let iceJSONString: string = <string>localStorage.getItem("currentIceOrder");
        let parsedIceOrder: IceOrder = <IceOrder>JSON.parse(iceJSONString);
        return parsedIceOrder;
    }
    function selectTags(): void {
        canvas = <HTMLCanvasElement>document.querySelector("canvas");
        crc2 = <CanvasRenderingContext2D>canvas.getContext("2d");

        totalPriceDisplay = <HTMLParagraphElement>document.querySelector("#totalPriceDisplay");
        versandForm = <HTMLFormElement>document.querySelector("#versandinfos");
        buy = <HTMLDivElement>document.querySelector("#buy");
        reset = <HTMLDivElement>document.querySelector("#reset");
        buy.addEventListener("click", handleBuy);
        reset.addEventListener("click", handleReset);

        submit = <HTMLInputElement>document.querySelector("#realSubmit");
        submit.addEventListener("click", handleSubmit);

        versandDiv = <HTMLDivElement>document.querySelector("#invisibleData");
    }

    function handleBuy(_event: Event): void {
        if (!iceOrder.container.iceBalls) {
            return;
        }
        versandDiv.innerHTML = "";
        versandIsDisplayed = true;

        let currentContainerNameString: string = iceOrder.container.name + "";
        let currentContainerPriceString: string = iceOrder.totalPrice.toFixed(2) + "";

        let newContainerInput: HTMLInputElement = document.createElement("input");
        let newPriceStringInput: HTMLInputElement = document.createElement("input");

        newPriceStringInput.setAttribute("id", "priceInput");
        newContainerInput.setAttribute("name", "Container");

        newPriceStringInput.setAttribute("value", currentContainerPriceString);
        newPriceStringInput.setAttribute("name", "price");

        newContainerInput.setAttribute("value", currentContainerNameString);

        let newContainerLabel: HTMLLabelElement = document.createElement("label");
        newContainerLabel.setAttribute("for", "Container");
        newContainerLabel.innerHTML = "Container: " + "<br>";

        let priceLabel: HTMLLabelElement = document.createElement("label");
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

    function displayToppings(): void {
        currentToppingNames = [];
        currentToppingAmounts = [];

        for (let index: number = 0; index < iceOrder.container.iceBalls.length; index++) {
            for (let topIndex: number = 0; topIndex < iceOrder.container.iceBalls[index].stickingToppings.length; topIndex++) {
                currentToppingNames.push(iceOrder.container.iceBalls[index].stickingToppings[topIndex].name);
            }
        }

        for (let iceBallNameIndex: number = 0; iceBallNameIndex < currentIceBallNames.length; iceBallNameIndex++) {
            for (let topIndex: number = 0; topIndex < iceOrder.container.iceBalls[iceBallNameIndex].stickingToppings.length; topIndex++) {
                currentToppingAmounts.push(countNameInArray(currentToppingNames[topIndex], currentToppingNames));
            }
        }

        let alreadyDisplayed: string[] = [];

        let sortedToppingNames: string[] = [];
        let sortedToppingAmounts: number[] = [];

        for (let index: number = 0; index < currentIceBallNames.length; index++) {
            for (let topIndex: number = 0; topIndex < iceOrder.container.iceBalls[index].stickingToppings.length; topIndex++) {
                currentToppingNames.push(iceOrder.container.iceBalls[index].stickingToppings[topIndex].name);
                if (!arrayContains(currentToppingNames[topIndex], alreadyDisplayed)) {
                    sortedToppingNames.push(currentToppingNames[topIndex]);
                    sortedToppingAmounts.push(currentToppingAmounts[topIndex]);
                    alreadyDisplayed.push(currentToppingNames[topIndex]);
                }
            }
        }


        let combined: string[] = [];

        for (let sortedIndex: number = 0; sortedIndex < sortedToppingNames.length; sortedIndex++) {
            let currentString: string = sortedToppingNames[sortedIndex] + ": " + sortedToppingAmounts[sortedIndex];
            combined.push(currentString);
        }

        let toppings: HTMLInputElement = document.createElement("input");
        toppings.setAttribute("name", "toppings");
        toppings.setAttribute("value", JSON.stringify(combined));

        versandDiv.append(toppings);
        versandDiv.append(document.createElement("br"));
    }
    function displayIceBalls(): void {
        currentIceBallNames = [];
        currentToppingAmounts = [];

        for (let index: number = 0; index < iceOrder.container.iceBalls.length; index++) {
            currentIceBallNames.push(iceOrder.container.iceBalls[index].iceSort.name);
        }

        for (let iceBallNameIndex: number = 0; iceBallNameIndex < currentIceBallNames.length; iceBallNameIndex++) {
            currentToppingAmounts.push(countNameInArray(currentIceBallNames[iceBallNameIndex], currentIceBallNames));

        }
        let alreadyDisplayed: string[] = [];

        let sortedIceBallNames: string[] = [];
        let sortedIceBallAmounts: number[] = [];

        for (let iceBallNameIndex: number = 0; iceBallNameIndex < currentIceBallNames.length; iceBallNameIndex++) {
            if (!arrayContains(currentIceBallNames[iceBallNameIndex], alreadyDisplayed)) {
                sortedIceBallNames.push(currentIceBallNames[iceBallNameIndex]);
                sortedIceBallAmounts.push(currentToppingAmounts[iceBallNameIndex]);
                alreadyDisplayed.push(currentIceBallNames[iceBallNameIndex]);
            }
        }

        let combined: string[] = [];

        for (let sortedIndex: number = 0; sortedIndex < sortedIceBallNames.length; sortedIndex++) {
            let currentString: string = sortedIceBallNames[sortedIndex] + ": " + sortedIceBallAmounts[sortedIndex];
            combined.push(currentString);
        }


        let iceBalls: HTMLInputElement = document.createElement("input");
        iceBalls.setAttribute("name", "iceBalls");
        iceBalls.setAttribute("value", JSON.stringify(combined));

        versandDiv.append(iceBalls);

        versandDiv.append(document.createElement("br"));
    }

    function arrayContains(_name: string, _array: string[]): boolean {
        for (let index: number = 0; index < _array.length; index++) {
            if (_name == _array[index]) {
                return true;
            }
        }
        return false;
    }
    function countNameInArray(_name: string, _array: string[]): number {
        let result: number = 0;
        for (let index: number = 0; index < _array.length; index++) {
            if (_name == _array[index]) {
                result++;
            }
        }
        return result;
    }
    function handleReset(_event: Event): void {
        localStorage.clear();
        location.reload();
    }
    function handleSubmit(_event: Event): void {
        communicate(baseURL, ActionTypes.set);
        versandIsDisplayed = true;
    }

    async function communicate(_sendURL: RequestInfo, _actionType: ActionTypes): Promise<void> {
        fakeFormData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>fakeFormData);
        _sendURL += "/";
        _sendURL += ActionTypes[_actionType];
        _sendURL += "?" + query.toString();

        let response: Response = await fetch(_sendURL);
        let responseText: string = await response.text();
    }

    function handleMouseDown(_event: MouseEvent): void {
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

    function drawBackground(_x: number, _y: number, _w: number, _h: number): void {
        crc2.beginPath();
        crc2.strokeStyle = backgroundColor;
        crc2.fillStyle = backgroundColor;
        crc2.rect(_x, _y, _w, _h);
        crc2.stroke();
        crc2.fill();
    }
    function drawCounterBar(): void {
        crc2.beginPath();
        crc2.strokeStyle = "#a0522d";
        crc2.lineWidth = 20;
        crc2.fillStyle = "#8b4513";
        crc2.rect(0, ContainerSelector.ballImpactPoint.y + ContainerSelector.currentTotalOffset.y, canvas.width, canvas.height);
        crc2.stroke();
        crc2.fill();
    }
    function animate(): void {
        frameCounter++;

        currentTime = Date.now();
        deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        timeSinceStart = currentTime - startTime;

        drawBackground(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
        icePicker.calculate(frameCounter);
        toppingPicker.calculate(frameCounter);
        ContainerSelector.calculate(frameCounter);
        ContainerSelector.update();

        drawCounterBar();
        icePicker.draw(frameCounter);
        toppingPicker.draw();

        let roundedTotalPrice: number = Math.round((totalPriceWithoutContainer + ContainerSelector.containerPrice) * 1000) / 1000;

        iceOrder.totalPrice = roundedTotalPrice + totalPriceFromLocalStorage;
        totalPriceDisplay.innerHTML = iceOrder.totalPrice.toFixed(2) + "€";

        //localStorage.setItem("currentIceBalls", JSON.stringify(iceOrder.container.iceBalls));

        versandForm.setAttribute("style", versandIsDisplayed ? "display: inline-block !important" : "display: none !important");
        requestAnimationFrame(animate);
    }
    function handleKeyDown(_event: KeyboardEvent): void {
        let k: string = _event.key;
        upKey = k == "ArrowUp";
        downKey = k == "ArrowDown";
        rightKey = k == "ArrowRight";
        leftKey = k == "ArrowLeft";
        if (k == " ") {
            spaceKey = spaceKey ? false : true;
        }
    }
    function handleKeyUp(_event: KeyboardEvent): void {
        upKey = downKey = leftKey = rightKey = false;
    }
}