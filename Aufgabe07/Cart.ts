namespace ShopJson {
    window.addEventListener("load", init);

    let container: HTMLDivElement;
    let articleDiv: HTMLDivElement;
    let counterLi: HTMLLIElement;
    let totalPrice: number;

    function init(_event: Event): void {
        container = <HTMLDivElement>document.querySelector("h2 + div");
        counterLi = <HTMLLIElement>document.querySelector(".counterCart");
        updateArticles();
    }

    export function updateArticles(): void {
        console.log("update");
        container.innerHTML = "";

        totalPrice = 0;
        for (let index: number = 0; index < localStorage.length; index++) {
            let key: string = <string>localStorage.key(index);
            let articleJson: string = <string>localStorage.getItem(key);

            let parsed: Article = <Article>JSON.parse(articleJson);
            let article: Article = Article.createFromJSON(parsed);

            totalPrice += article.price;

            articleDiv = article.buildDiv(false);
            container.append(articleDiv);
        }
        updateCounter();
    }

    export function updateCounter(): void {
        console.log(totalPrice);

        counterLi.setAttribute("style", totalPrice <= 0 ? "display:none !important" : "display:inline-block !important");
        counterLi.innerHTML = totalPrice <= 0 ? "" : totalPrice + "€";
        if (totalPrice <= 0) {
            container.innerHTML = "Der Einkaufswagen ist leer";
            container.style.font = "22px Arial, sans-serif";
        }
    }
}