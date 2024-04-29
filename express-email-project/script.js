// Функція для очищення завантажених фотографій
function clearPhotos() {
    const fileInput = document.getElementById('skin-photos'); 
    fileInput.value = ''; // Очищення поля вводу
    const images = document.querySelectorAll('img.uploaded-photo');
    images.forEach((img) => img.remove()); // Видалення зображень
}

// Обробка зміни файлів
document.getElementById('skin-photos').addEventListener('change', function() {
    const files = this.files;
    let container = document.querySelector('.photo-container');

    if (!container) {
        container = document.createElement('div');
        container.classList.add('photo-container');
        this.parentElement.appendChild(container);
    }

    // Завантаження файлів
    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.classList.add('uploaded-photo');
            img.src = e.target.result;
            img.addEventListener('click', () => img.classList.toggle('fullscreen'));
            container.appendChild(img);
        };
        reader.readAsDataURL(file); // Читання даних файлу
    });

    container.style.marginTop = '10px';
});

// Обробка кнопки очищення
document.getElementById('clear-btn').addEventListener('click', clearPhotos);

// Відправлення POST-запиту з FormData
document.getElementById('submit-btn').addEventListener('click', function() {
    const form = document.getElementById('skincare-form');
    const formData = new FormData(form); // Використання FormData для передачі даних

    // Відправлення POST-запиту на сервер
    fetch('/send-email', {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        if (response.ok) {
            // Зміна фону на зелений і відображення повідомлення
            document.body.style.backgroundColor = '#022202de';
            document.body.innerHTML = `
                <div style="text-align: center; padding: 20px; color: white;">
                    <h2>Анкета успішно надіслана!</h2>
                    <p>Обробка анкети може зайняти до 24 годин. Дякуємо, що обрали косметолога для свого здоров'я!</p>
                </div>
            `;
        } else {
            alert('Помилка під час відправлення');
        }
    })
    .catch((error) => {
        console.error('Помилка під час відправлення:', error);
        alert('Виникла помилка під час відправлення анкети');
    });
});
