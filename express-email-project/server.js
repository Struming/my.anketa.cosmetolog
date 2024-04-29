const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require("fs");
const path = require("path");
const multer = require('multer');

dotenv.config();

const PORT = process.env.PORT || 3000; 

// Створення директорії для зберігання файлів
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Налаштування сховища для Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Директорія, куди зберігатимуться файли
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Унікальне ім'я файлу
    },
});

const upload = multer({ storage });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Для обслуговування статичних файлів



// Маршрут для обробки POST-запитів та збереження даних анкети
app.post('/send-email', upload.array('skin-photos', 10), async (req, res) => {
    const formData = req.body;
    const uploadedFiles = req.files;

    const timestamp = Date.now();
    const jsonPath = `${uploadDir}/anketa-${timestamp}.json`;

    const photoUrls = uploadedFiles.map(file => `http://localhost:${PORT}/download/${file.filename}`);

    const data = {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        phone: formData.phone,
        skinType: formData['skin-type'],
        skinIssue: formData['skin-issue'],
        skincareProducts: formData['skincare-products'],
        priorityIssue: formData['priority-issue'],
        specificProducts: formData['specific-products'],
        cosmetologist: formData.cosmetologist,
        dermatologist: formData.dermatologist,
        medication: formData.medication,
        pregnancy: formData.pregnancy,
        lactation: formData.lactation,
        oncologyTreatment: formData['oncology-treatment'],
        budget: formData.budget,
        photoUrls // Включаємо посилання на фото
    };

    fs.writeFileSync(jsonPath, JSON.stringify(data));

    const telegramToken = '7182029167:AAGqX3hN7v7tXNAtDvl6bmJJ_9g-7wIFEYc'; // Ваш токен
    const telegramChatId = 593031390; // ID чату для повідомлень
    const telegramApiUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    const webUrl = `http://localhost:${PORT}/anketa-${timestamp}`;

    const telegramMessage = `
Анкета від ${formData.name}.
Посилання на веб-сторінку: ${webUrl}
`;


    try {
        await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: telegramChatId,
            text: telegramMessage,
        });

        res.status(200).send('Посилання на анкету успішно надіслано');
    } catch (error) {
        console.error('Помилка надсилання посилання в Telegram:', error);
        res.status(500).send('Помилка надсилання посилання в Telegram');
    }
});

// Маршрут для завантаження файлів
app.use('/download', express.static(uploadDir)); 

// Маршрут для відображення анкети як веб-сторінки
app.get(`/anketa-:timestamp`, (req, res) => {
    const { timestamp } = req.params;
    const jsonPath = `${uploadDir}/anketa-${timestamp}.json`;

    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath));

        res.send(`
            <!DOCTYPE html>
            <html lang="uk">
            <head>
                <title>Анкета для догляду за шкірою - ${data.name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Анкета для догляду за шкірою</h1>
                    <p>Ім'я: ${data.name}</p>
                    <p>Вік: ${data.age}</p>
                    <p>Електронна пошта: ${data.email}</p>
                    <p>Телефон: ${data.phone}</p>
                    <p>Тип шкіри: ${data.skinType}</p>
                    <p>Основна проблема: ${data.skinIssue}</p>
                    <p>Ранкові та вечірні засоби: ${data.skincareProducts}</p>
                    <p>Пріоритетна проблема: ${data.priorityIssue}</p>
                    <p>Конкретні засоби: ${data.specificProducts}</p>
                    <p>Косметолог: ${data.cosmetologist}</p>
                    <p>Дерматолог: ${data.dermatologist}</p>
                    <p>Ліки: ${data.medication}</p>
                    <p>Вагітність: ${data.pregnancy}</p>
                    <p>Лактація: ${data.lactation}</p>
                    <p>Онкологічне лікування: ${data.oncologyTreatment}</p>
                    <p>Бюджет: ${data.budget}</p>
                    <!-- Відображаємо фото -->
                    <h2>Фотографії</h2>
                    ${data.photoUrls.map(url => `<img src="${url}" alt="Фото шкіри" style="max-width: 100%; margin: 10px 0;">`).join('')}
                </div>
            </body>
            </html>
        `);
    } else {
        res.status(404).send('Анкета не знайдена');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
