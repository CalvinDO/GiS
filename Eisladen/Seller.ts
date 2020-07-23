namespace Eisladen {
    window.addEventListener("load", init);

    export let incomingOrderDisplay: IncomingOrderDisplay;
    export let sellerCanvas: HTMLCanvasElement;
    export let sellerCrc2: CanvasRenderingContext2D;

    export let incomingOrderRegion: HTMLDivElement;

    export let currentSellerTime: number;
    export let lastFrameSellerTime: number;
    export let deltaSellerTime: number;

    export let startSellerTime: number;
    export let sellerTimeSinceStart: number;

    function init(_event: Event): void {
        selectTags();
        currentSellerTime = lastFrameSellerTime = startSellerTime = Date.now();

        incomingOrderDisplay = new IncomingOrderDisplay();

        animate();
    }

    function selectTags(): void {
        sellerCanvas = <HTMLCanvasElement>document.querySelector("canvas");
        sellerCrc2 = <CanvasRenderingContext2D>sellerCanvas.getContext("2d");

        incomingOrderRegion = <HTMLDivElement>document.querySelector("#incomingOrderRegion");
    }

    function animate(): void {
        currentSellerTime = Date.now();

        deltaSellerTime = currentSellerTime - lastFrameSellerTime;

        lastFrameSellerTime = currentSellerTime;

        sellerTimeSinceStart = currentSellerTime - startSellerTime;

        incomingOrderDisplay.calculate();
        incomingOrderDisplay.draw();

        requestAnimationFrame(animate);
    }
}