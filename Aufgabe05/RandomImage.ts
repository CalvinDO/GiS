namespace Shop {
    interface Google {
        search: Search;
        load(_search: string, _index: string): number;
        setOnLoadCallback(_callback: Function): void;
    }

    interface Search {
        results: { url: string }[];
        ImageSearch: { new(): Search };
        setSearchCompleteCallback(_object: Object, _callback: Function, _nullerObject: null): void;
        execute(_keyword: string): void;
    }
    declare let google: Google;

    export class RandomImage {

        public keyword: string;
        public search: Search;

        constructor(_keyword: string) {
            this.keyword = _keyword;
            google.load("search", "1");
            google.setOnLoadCallback(this.OnLoad);
            console.log(google);
        }

        public OnLoad(): void {
            this.search = new google.search.ImageSearch();
            this.search.setSearchCompleteCallback(this, this.searchComplete, null);
            this.search.execute(this.keyword);
            this.searchComplete();
        }
        public searchComplete(): void {
            try {
                if (this.search.results != null) {
                    if (this.search.results.length > 0) {
                        let rnd: number = Math.floor(Math.random() * this.search.results.length);
                        document.body.style.backgroundImage = `url(${this.search.results[rnd]["url"]})`;
                        console.log(`url(${this.search.results[rnd]["url"]})`);
                    }
                }
            } catch (_error) {
                console.log(_error);
            }
        }
    }
}
