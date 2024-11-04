

const fetch = require('node-fetch');
const cheerio = require('cheerio');

class Scraper {
    constructor(bot, chatId) {
        this.bot = bot;
        this.chatId = chatId;
        this.previousData = {};
    }

    async sendMessage(message) {
        try {
            await this.bot.sendMessage(this.chatId, message);
        } catch (error) {
            console.error(`Error sending message: ${error}`);
        }
    }

    async getSummary(url) {
        try {
            const headers = { 'User-Agent': 'Mozilla/5.0' };
            const response = await fetch(url, { headers });
            const html = await response.text();
            const $ = cheerio.load(html);

            const indicators = {};
            $('table tr').each((_, row) => {
                const cells = $(row).find('td');
                if (cells.length >= 2) {
                    const indicatorName = $(cells[0]).text().trim();
                    const indicatorValue = $(cells[1]).text().trim();
                    indicators[indicatorName] = indicatorValue;
                }
            });

            return indicators;
        } catch (error) {
            console.error(`Error parsing ${url}: ${error}`);
            return null;
        }
    }

    async checkPair(pair) {
        const currentSummary = await this.getSummary(pair.url);

        if (currentSummary === null) return;

        if (JSON.stringify(this.previousData[pair.name]) !== JSON.stringify(currentSummary)) {
            const colorEmoji = this.getColorEmoji(currentSummary);
            const message = `${pair.name} - ${JSON.stringify(currentSummary)} ${colorEmoji}`;
            await this.sendMessage(message);
            console.log(message);
            this.previousData[pair.name] = currentSummary;
        } else {
            console.log(`No changes for ${pair.name}`);
        }
    }

    getColorEmoji(signal) {
        if (Object.values(signal).includes("Strong Sell")) return '🔴';
        if (Object.values(signal).includes("Strong Buy")) return '🟢';
        if (Object.values(signal).includes("Buy")) return '🟩';
        if (Object.values(signal).includes("Neutral")) return '🟡';
        if (Object.values(signal).includes("Sell")) return '🟥';
        return '';
    }
}

module.exports = Scraper;
