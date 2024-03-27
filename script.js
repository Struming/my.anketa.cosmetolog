function clearPhotos() {
            document.getElementById('skin-photos').value = '';
            var images = document.querySelectorAll('img.uploaded-photo');
            images.forEach(function(img) {
                img.remove();
            });
        }

        document.getElementById('skin-photos').addEventListener('change', function() {
            var files = this.files;
            var container = document.createElement('div');
            container.classList.add('photo-container');

            var existingContainer = document.querySelector('.photo-container');
            if (existingContainer) {
                container = existingContainer;
            }

            for (var i = 0; i < files.length; i++) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var img = document.createElement('img');
                    img.classList.add('uploaded-photo');
                    img.src = e.target.result;
                    img.addEventListener('click', function() {
                        if (!img.classList.contains('fullscreen')) {
                            img.classList.add('fullscreen');
                        } else {
                            img.classList.remove('fullscreen');
                        }
                    });
                    container.appendChild(img);
                }
                reader.readAsDataURL(files[i]);
            }

            if (!existingContainer) {
                var formGroup = this.parentElement;
                formGroup.appendChild(container);
            }

            container.style.marginTop = '10px';
        });

        document.querySelector('#clear-btn').addEventListener('click', function() {
            clearPhotos();
        });


        const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Обробка POST-запиту з форми
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Конфігурація транспортера для відправки пошти
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-password'
        }
    });

    // Налаштування електронного листа
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@example.com',
        subject: 'Нове повідомлення від користувача',
        text: `Ім'я: ${name}\nЕлектронна пошта: ${email}\nПовідомлення: ${message}`
    };

    // Відправлення електронного листа
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Під час відправки листа сталася помилка');
        } else {
            console.log('Email відправлений: ' + info.response);
            res.send('Повідомлення успішно відправлено');
        }
    });
});

app.listen(port, () => {
    console.log(`Сервер запущено на порту ${port}`);
});

