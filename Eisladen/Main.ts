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

    export let gravity: Vector2D = new Vector2D(0, 0.1);

    export let iceOrder: IceOrder;

    export let totalPriceWithoutContainer: number = 0;
    let versandForm: HTMLFormElement;
    let versandIsDisplayed: boolean;

    let buy: HTMLDivElement;
    let submit: HTMLButtonElement;

    let reset: HTMLDivElement;

    let totalPriceDisplay: HTMLParagraphElement;

    export let localStorageIceOrderContainerReady: boolean;
    export let localStorageIceOrderIceBallsReady: boolean;

    function init(_event: Event): void {
        ContainerSelector.init();
        selectTags();

        //localStorage.clear();


        if (localStorage.getItem("currentIceOrder")) {
            iceOrder = loadIceFromLocalStorage();
            console.log(iceOrder);
            if (iceOrder.container) {
                localStorageIceOrderContainerReady = true;
                if (iceOrder.container.iceBalls) {
                    localStorageIceOrderIceBallsReady = true;
                }
            }
        } else {
            iceOrder = new IceOrder();
        }

        icePicker = new IcePicker();
        toppingPicker = new ToppingPicker();

        animate();
    }

    export function updateLocalStorage(): void {
        console.log(Eisladen.iceOrder);
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

        submit = <HTMLButtonElement>document.querySelector("#realSubmit");
        submit.addEventListener("click", handleSubmit);
    }

    function handleBuy(_event: Event): void {
        versandIsDisplayed = true;
    }
    function handleReset(_event: Event): void {

    }
    function handleSubmit(_event: Event): void {

    }
    function handleMouseDown(_event: MouseEvent): void {
        toppingPicker.checkMouseClick(_event.clientX, _event.clientY);

        if (versandIsDisplayed) {
            let xMin: number = canvas.width / 4;
            let xMax: number = canvas.width / 4 + canvas.width / 2;
            let yMin: number = canvas.height / 4;
            let yMax: number = canvas.height / 4 + canvas.height / 2;
            if ((_event.clientX < xMin || _event.clientX > xMax) || (_event.clientY < yMin || _event.clientY > yMax)) {
                versandIsDisplayed = false;
            }
        }

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
        drawBackground(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
        icePicker.calculate(frameCounter);
        toppingPicker.calculate(frameCounter);
        ContainerSelector.calculate(frameCounter);
        ContainerSelector.update();

        drawCounterBar();
        icePicker.draw(frameCounter);
        toppingPicker.draw();

        let roundedTotalPrice: number = Math.round((totalPriceWithoutContainer + ContainerSelector.containerPrice) * 1000) / 1000;

        totalPriceDisplay.innerHTML = roundedTotalPrice + "€";
        iceOrder.totalPrice = roundedTotalPrice + "€";

        Eisladen.updateLocalStorage();
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