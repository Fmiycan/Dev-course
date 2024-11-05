const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import * as cheerio from 'cheerio';

class Scraper {
    constructor(pair, token, chatId, targetTime = '15m') {
        this.pair = pair;
        this.token = token;
        this.chatId = chatId;
        this.targetTime = targetTime;
        this.previousData = {};
    }

    // Метод для запроса и парсинга данных
    async fetchData() {
        try {
            const response = await fetch(this.pair.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!response.ok) throw new Error(`Ошибка сети: ${response.statusText}`);
            const html = await response.text();
            const $ = cheerio.load(html);

            // Установка нужного временного интервала
            const tablist = $('[role="tablist"]');
            if (tablist.length) {
                tablist.find('button').each((_, button) => {
                    if ($(button).data('test') === this.targetTime) {
                        $(button).attr('aria-selected', 'true');
                        console.log(`Выбрано значение времени: ${$(button).text().trim()}`);
                    }
                });
            }

            // Парсим таблицу технических индикаторов
            const technicalData = {};
            $('tbody.datatable_body__tb4jX tr').each((_, row) => {
                const columns = $(row).find('td');
                if (columns.length === 4) {
                    const indicator = $(columns[0]).text().trim();
                    const value = $(columns[1]).text().trim();
                    const signal = $(columns[2]).text().trim();
                    technicalData[indicator] = { value, signal };
                }
            });

            return technicalData;
        } catch (error) {
            console.error(`Ошибка при парсинге данных для ${this.pair.name}:`, error);
            return null;
        }
    }

    // Метод добавления эмодзи к значениям сигналов
    addEmoji(signal) {
        if (signal.includes('Strong Buy')) return '🟢 Strong Buy';
        if (signal.includes('Buy')) return '🟡 Buy';
        if (signal.includes('Strong Sell')) return '🔴 Strong Sell';
        if (signal.includes('Sell')) return '🟠 Sell';
        if (signal.includes('Neutral')) return '⚪ Neutral';
        return signal;
    }

    // Отправка сообщения в Telegram с обновлениями по индикаторам
    async sendToTelegram(message) {
        try {
            const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
            const payload = {
                chat_id: this.chatId,
                text: message,
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!result.ok) throw new Error(`Ошибка Telegram: ${result.description}`);
            console.log(`Сообщение отправлено в Telegram: ${message}`);
        } catch (error) {
            console.error('Ошибка при отправке сообщения в Telegram:', error);
        }
    }

    // Проверка изменений и отправка обновлений
    async checkAndUpdate() {
        const currentData = await this.fetchData();
        if (!currentData) return;

        const updates = [];
        for (const [indicator, data] of Object.entries(currentData)) {
            const previous = this.previousData[indicator];
            if (!previous || previous.value !== data.value || previous.signal !== data.signal) {
                updates.push(
                    `${this.pair.name} - ${indicator}: Value=${data.value}, Signal=${this.addEmoji(data.signal)}`
                );
            }
        }

        // Если есть обновления, отправляем в Telegram
        if (updates.length > 0) {
            const message = updates.join('\n');
            await this.sendToTelegram(message);
            this.previousData = currentData; // Обновляем предыдущие данные
        } else {
            console.log(`Нет изменений для ${this.pair.name}`);
        }
    }

    // Запуск процесса парсинга и обновления
    async startScraping() {
        setInterval(async () => {
            await this.checkAndUpdate();
        }, 30000); // Интервал в 30 секунд для проверки обновлений
    }
}

export default Scraper;
