namespace Aufgabe09Server {
    window.addEventListener("load", init);
    let formData: FormData;
    let buttonHTML: HTMLButtonElement;
    let buttonJSON: HTMLButtonElement;

    let baseUrl: string = "http://localhost:8100";

    let responseDisplayDiv: HTMLDivElement;

    function init(_event: Event): void {
        buttonJSON = <HTMLButtonElement>document.querySelector("#json");
        buttonJSON.addEventListener("click", handleSubmitJSON);
        buttonHTML = <HTMLButtonElement>document.querySelector("#html");
        buttonHTML.addEventListener("click", handleSubmitHTML);

        loadDisplayDiv();
    }

    async function communicate(_sendURL: RequestInfo, _isHTML: boolean): Promise<void> {
        formData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        _sendURL += _isHTML ? "/html" : "/json";
        _sendURL += "?" + query.toString();

        console.log("url:  " + _sendURL);

        let response: Response = await fetch(_sendURL);
        let responseText: string = await response.text();

        updateDisplayDiv(responseText);

        if (!_isHTML) {
            let responseJSON: JSON = JSON.parse(responseText);
            console.log(responseJSON);
        }

        console.log("response:  " + responseText);
    }

    function updateDisplayDiv(_responseString: string): void {
        responseDisplayDiv.innerHTML = _responseString;
    }

    function loadDisplayDiv(): void {
        responseDisplayDiv = <HTMLDivElement>document.querySelector("footer div");
        console.log(responseDisplayDiv);
    }

    function handleSubmitJSON(_event: MouseEvent): void {
        communicate(baseUrl, false);
    }
    function handleSubmitHTML(_event: MouseEvent): void {
        communicate(baseUrl, true);
    }
}
