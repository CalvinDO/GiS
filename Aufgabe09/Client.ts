namespace Aufgabe09Server {
    window.addEventListener("load", init);
    let formData: FormData;
    let button: HTMLButtonElement;
    let url: string = "http://localhost:8100";

    let responseDisplayDiv: HTMLDivElement;

    function init(_event: Event): void {
        button = <HTMLButtonElement>document.querySelector("button[type = button]");
        button.addEventListener("click", handleSubmit);

        loadDisplayDiv();
    }

    async function communicate(_url: RequestInfo): Promise<void> {
        formData = new FormData(document.forms[0]);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        _url += "?" + query.toString();

        // console.log("url:  " + url);
        let response: Response = await fetch(_url);

        let responseText: string = await response.text();

        updateDisplayDiv(responseText);
        let responseJSON: JSON = JSON.parse(responseText);
        console.log(responseJSON);

        console.log("response:  " + responseText);
    }

    function updateDisplayDiv(_responseString: string): void {
        responseDisplayDiv.innerHTML = _responseString;
    }

    function loadDisplayDiv(): void {
        responseDisplayDiv = <HTMLDivElement>document.querySelector("footer div");
        console.log(responseDisplayDiv);
    }

    function handleSubmit(_event: MouseEvent): void {
        communicate(url);
    }
}
