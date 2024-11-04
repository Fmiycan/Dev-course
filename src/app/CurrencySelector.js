// CurrencySelector.js

class CurrencySelector {
    constructor(pairs) {
        this.pairs = pairs;
    }

    selectPair() {
        // For demonstration, select the first pair; this could be made interactive.
        return this.pairs[0];
    }
}

module.exports = CurrencySelector;
