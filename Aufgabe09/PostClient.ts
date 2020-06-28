namespace Aufgabe09Server {
    window.addEventListener("load", init);
    let formData: FormData;
    let buttonPost: HTMLButtonElement;

    let baseUrl: string = "https://dercalvino.herokuapp.com";

    let responseDisplayDiv: HTMLDivElement;

    function init(_event: Event): void {
        buttonPost = <HTMLButtonElement>document.querySelector("button[type = button]");
        buttonPost.addEventListener("click", handleSubmitPOST);

        loadDisplayDiv();
    }

    async function communicate(_sendURL: RequestInfo): Promise<void> {
        formData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        //_sendURL += "?" + query.toString();

        console.log("url:  " + _sendURL);

        //let response: Response = await fetch(_sendURL);

        let response: Response = await fetch(_sendURL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(formData)
        });


        let responseText: string = await response.text();

        updateDisplayDiv(responseText);

        console.log("response:  " + responseText);
    }

    function updateDisplayDiv(_responseString: string): void {
        responseDisplayDiv.innerHTML = _responseString;
    }

    function loadDisplayDiv(): void {
        responseDisplayDiv = <HTMLDivElement>document.querySelector("footer div");
    }
    function handleSubmitPOST(_event: MouseEvent): void {
        communicate(baseUrl);
    }
}
