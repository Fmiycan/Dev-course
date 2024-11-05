// CurrencySelector.js

module.exports = class CurrencySelector {
    constructor(pairs) {
        this.pairs = pairs;
    }

    selectPair() {
        return this.pairs[0];
    }
}

