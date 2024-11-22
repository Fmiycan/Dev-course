require('dotenv').config();  // Load environment variables
const Scraper = require('./Scraper.js');
const TelegramBot = require('node-telegram-bot-api');
const CurrencySelector = require('./CurrencySelector');


// Load token and chat ID from environment variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

pairs = [
  {'name': 'AUD/CHF', 'url': 'https://www.investing.com/currencies/aud-chf-technical'},
  {'name': 'CHF/JPY', 'url': 'https://www.investing.com/currencies/chf-jpy-technical'},
  {'name': 'EUR/GBP', 'url': 'https://www.investing.com/currencies/eur-gbp-technical'},
  {'name': 'EUR/USD', 'url': 'https://www.investing.com/currencies/eur-usd-technical'},
  {'name': 'CAD/CHF', 'url': 'https://www.investing.com/currencies/cad-chf-technical'},
  {'name': 'AUD/CAD', 'url': 'https://www.investing.com/currencies/aud-cad-technical'},
  {'name': 'AUD/JPY', 'url': 'https://www.investing.com/currencies/aud-jpy-technical'},
  {'name': 'EUR/AUD', 'url': 'https://www.investing.com/currencies/eur-aud-technical'},
  {'name': 'USD/CAD', 'url': 'https://www.investing.com/currencies/usd-cad-technical'},
  {'name': 'CAD/JPY', 'url': 'https://www.investing.com/currencies/cad-jpy-technical'},
  {'name': 'GBP/JPY', 'url': 'https://www.investing.com/currencies/gbp-jpy-technical'},
  {'name': 'GBP/CHF', 'url': 'https://www.investing.com/currencies/gbp-chf-technical'},
  {'name': 'AUD/USD', 'url': 'https://www.investing.com/currencies/aud-usd-technical'},
  {'name': 'EUR/JPY', 'url': 'https://www.investing.com/currencies/eur-jpy-technical'},
  {'name': 'GBP/USD', 'url': 'https://www.investing.com/currencies/gbp-usd-technical'},
  {'name': 'USD/CHF', 'url': 'https://www.investing.com/currencies/usd-chf-technical'},
  {'name': 'GBP/CAD', 'url': 'https://www.investing.com/currencies/gbp-cad-technical'},
  {'name': 'EUR/CHF', 'url': 'https://www.investing.com/currencies/eur-chf-technical'}
]

const currencySelector = new CurrencySelector(pairs);
const selectedPair = currencySelector.selectPair();
const scraper = new Scraper(selectedPair, TELEGRAM_TOKEN, CHAT_ID);

async function main() {
    await scraper.startScraping();
    console.log("start")
    setInterval(async () => {
        await scraper.startScraping();
    }, 30000); // Runs every 30 seconds
}

main();