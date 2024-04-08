const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware для обробки статичних файлів (стилів CSS та JS)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Відправити файл index.html
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'komunarmarin@gmail.com', // Ваша електронна пошта
            pass: '82tutono' // Ваш пароль
        }
    });

    const mailOptions = {
        from: 'komunarmarin@gmail.com', // Ваша електронна пошта
        to: 'anketa.example@gmail.com', // Електронна пошта отримувача
        subject: "Повідомлення з форми зворотнього зв'язку",
        text: `Ім'я: ${name}\nЕлектронна пошта: ${email}\nПовідомлення: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Помилка відправлення листа');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Лист успішно надіслано');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
