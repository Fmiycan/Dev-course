# Dockerfile
FROM node:20.13.1

# Создание директории приложения
WORKDIR /src/app

# Установка зависимостей приложения
# Используется символ подстановки для копирования обоих файлов package.json и package-lock.json
COPY package*.json ./

RUN npm install

# Копирование исходного кода приложения
COPY . .

# Привязка порта, который будет использоваться приложением
EXPOSE 8000

CMD [ "node", "src/app/app.js" ]
