namespace ShopJson {
    window.addEventListener("load", init);

    export let articleCount: number = 0;
    export let priceCount: number = 0;

    //export let cart: Cart;

    let divs: HTMLDivElement[] = [];
    let showIndex: number;

    let categorysJSON: Article[][] = [];
    let category: Article[] = [];
    let categorys: Article[][] = [];

    function init(_event: Event): void {
        communicate("Articles.json");

        loadNavListeners();
        loadSearchListener();
    }

    async function communicate(_url: RequestInfo): Promise<void> {
        let response: Response = await fetch(_url);
        categorysJSON = <Article[][]>await response.json();

        loadArticles(categorysJSON);
    }

    function loadArticles(_categories: Article[][]): void {
        for (let categoryJSON of _categories) {
            category = [];
            for (let article of categoryJSON) {
                category.push(new Article(article.name, article.description, article.image, article.price));
            }
            categorys.push(category);
        }
        let productsDiv: HTMLDivElement = document.createElement("div");
        let index: number;

        for (let category of categorys) {
            index = categorys.indexOf(category) * 2 + 2;
            productsDiv = <HTMLDivElement>document.querySelector("h2:nth-child(" + index + ") + div");
            divs.push(productsDiv);

            for (let article of category) {
                productsDiv.append(article.buildDiv());
            }
        }
    }

    function loadNavListeners(): void {
        let navButton: HTMLAnchorElement;
        let logo: HTMLAnchorElement = <HTMLAnchorElement>document.querySelector("h1>a");
        logo.addEventListener("click", handleClickCategory.bind(logo));
        for (let liIndex: number = 1; liIndex < 4; liIndex++) {
            navButton = <HTMLAnchorElement>document.querySelector(".nav-list li:nth-child(" + liIndex + ") a");
            navButton.addEventListener("click", handleClickCategory.bind(navButton));
        }
    }

    function loadSearchListener(): void {
        let searchButton: HTMLAnchorElement;
        let searchInput: HTMLInputElement = <HTMLInputElement>document.querySelector("nav input");
        searchButton = <HTMLAnchorElement>document.querySelector("li:last-child a");
        searchButton.addEventListener("click", handleClickSearch.bind(searchInput));
    }
    
    function handleClickSearch(this: HTMLInputElement, _event: MouseEvent): void {
        showElementsContaining(this.value);
    }

    function showElementsContaining(_substring: string): void {
        console.log(_substring);
        let searchRegEx: RegExp = new RegExp(_substring.toLowerCase());

        let name: string;
        let description: string;
        let bothKonkat: string;

        let articleDiv: HTMLDivElement;

        let match: boolean;
        for (let category of categorys) {
            for (let article of category) {
                name = article.name;
                description = article.description;
                bothKonkat = name + description;
                articleDiv = <HTMLDivElement>document.querySelector("#" + name);

                match = searchRegEx.test(bothKonkat.toLowerCase());
                articleDiv.style.display = match ? "flex" : "none";
            }
        }
    }

    function handleClickCategory(this: HTMLAnchorElement, _click: MouseEvent): void {
        let clickedAtt: string = <string>this.getAttribute("href");
        switch (clickedAtt) {
            case "#Startseite":
                showIndex = -1;
                break;
            case "#Holzscheite":
                showIndex = 0;
                break;
            case "#Holzpellets":
                showIndex = 1;
                break;
            case "#Holzspäne":
                showIndex = 2;
                break;
        }

        for (let i: number = 0; i <= divs.length; i++) {
            let div: HTMLDivElement = <HTMLDivElement>divs[i];
            if (showIndex != -1) {
                div.style.display = showIndex == i ? "flex" : "none";
            } else {
                div.style.display = "flex";
            }
        }
    }
}
