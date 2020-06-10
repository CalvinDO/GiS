namespace ShopJson {
    window.addEventListener("load", init);

    let container: HTMLDivElement;
    let articleDiv: HTMLDivElement;

    import Article = ShopJson.Article;

    function init(): void {
        container = <HTMLDivElement>document.querySelector("h2 + div");
        buildArticles();
    }

    function buildArticles(): void {
        console.log(localStorage);

        let parsed: Article;

        for (let index: number = 0; index < localStorage.length; index++) {
            let key: string = <string>localStorage.key(index);
            let articleJson: string = <string>localStorage.getItem(key);
            parsed = <Article>JSON.parse(articleJson);
            
            let article: Article = Article.createFromJSON(parsed);

            articleDiv = article.buildDiv();
            container.append(articleDiv);

            console.log(articleDiv);
        }
    }
}