"use strict";
var ShopJson;
(function (ShopJson) {
    class RandomImagePicker {
        constructor(_keyword) {
            this.keyword = _keyword;
            google.load("search", "1");
            google.setOnLoadCallback(this.OnLoad);
            console.log(google);
        }
        OnLoad() {
            this.search = new google.search.ImageSearch();
            this.search.setSearchCompleteCallback(this, this.searchComplete, null);
            this.search.execute(this.keyword);
            this.searchComplete();
        }
        searchComplete() {
            try {
                if (this.search.results != null) {
                    if (this.search.results.length > 0) {
                        let rnd = Math.floor(Math.random() * this.search.results.length);
                        document.body.style.backgroundImage = `url(${this.search.results[rnd]["url"]})`;
                        console.log(`url(${this.search.results[rnd]["url"]})`);
                    }
                }
            }
            catch (_error) {
                console.log(_error);
            }
        }
    }
    ShopJson.RandomImagePicker = RandomImagePicker;
})(ShopJson || (ShopJson = {}));
//# sourceMappingURL=RandomImagePicker.js.map