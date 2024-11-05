// CurrencySelector.js

class CurrencySelector {
    constructor(pairs) {
        this.pairs = pairs;
    }

    selectPair() {
        // For simplicity, this selects the first pair; modify for dynamic selection
        return this.pairs[0];
    }
}

module.exports = CurrencySelector;
