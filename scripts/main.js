// === Глобальные переменные ===
let currentSection = null;
let sectionsCache = {}; // Кэш для загруженных секций

// === Функция открытия раздела ===
function openSection(id) {
    if (currentSection === id) return;

    // Скрываем меню
    document.getElementById('menu').classList.remove('active');

    // Показываем лоадер
    const container = document.getElementById('current-section');
    container.innerHTML = '<div class="loading-text">Загрузка...</div>';

    // Загружаем секцию
    loadSection(id);
}

// === Функция загрузки секции ===
function loadSection(id) {
    // Если секция уже есть в кэше — используем её
    if (sectionsCache[id]) {
        showSection(id, sectionsCache[id]);
        return;
    }

    // Загружаем секцию из папки sections/
    fetch(`sections/${id}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            sectionsCache[id] = html; // сохраняем в кэш
            showSection(id, html);
        })
        .catch(error => {
            console.error(`Ошибка загрузки секции ${id}:`, error);
            document.getElementById('current-section').innerHTML =
                `<p style="color:white;">Ошибка загрузки раздела "${id}".</p>`;
        });
}

// === Функция показа секции ===
function showSection(id, html) {
    const container = document.getElementById('current-section');
    container.innerHTML = html;

    let sectionElement = container.querySelector('.section');
    if (!sectionElement) {
        // если в html нет .section — создаем обертку
        const wrapper = document.createElement('div');
        wrapper.className = 'section';
        wrapper.innerHTML = html;
        container.innerHTML = '';
        container.appendChild(wrapper);
        sectionElement = wrapper;
    }

    // Устанавливаем id и активируем секцию
    sectionElement.id = id;
    setTimeout(() => sectionElement.classList.add('active'), 50);

    currentSection = id;

    // Инициализация для специфических секций
    setTimeout(() => {
        if (id === 'works') renderWorks();
        setupAllAudioControls();
        applyCenteringStyles();
    }, 100);
}

// === Принудительное выравнивание содержимого ===
function applyCenteringStyles() {
    const section = document.querySelector('#current-section .section.active');
    if (section) {
        section.style.display = 'flex';
        section.style.justifyContent = 'center';
        section.style.alignItems = 'center';
        section.style.flexDirection = 'column';
        section.style.textAlign = 'center';
    }
}

// === Возврат в меню ===
function goBack() {
    document.getElementById('current-section').innerHTML = '';
    document.getElementById('menu').classList.add('active');
    currentSection = null;
}

// === Поиск песни ===
function findSong() {
    const code = document.getElementById('songCode').value.trim();
    const song = songs.find(s => s.code === code);

    if (!song) {
        alert("Песня с таким кодом не найдена 😢");
        return;
    }

    document.getElementById('songInfo').style.display = 'block';
    document.getElementById('songTitle').textContent = song.title;
    document.getElementById('demoPlayer').src = song.demo;

    document.getElementById('buySection').innerHTML = `
        <p>Цена: ${song.price}₽</p>
        <button onclick="buyWork('${song.code}', ${song.price})">💳 Оплатить</button>
    `;

    setTimeout(() => {
        const demoPlayer = document.getElementById('demoPlayer');
        setupAudioControl(demoPlayer);
    }, 100);
}

// === Оплата конкретной песни ===
function buyWork(code, price) {
    window.open(`${workerUrl}/?code=${code}&price=${price}`, '_blank');
}

// === Оплата тарифного плана ===
function buyPlan(plan, price) {
    window.open(`${workerUrl}/?plan=${encodeURIComponent(plan)}&planPrice=${price}`, '_blank');
}

// === Отрисовка всех песен ===
function renderWorks() {
    const worksContainer = document.getElementById('worksContainer');
    if (!worksContainer) return;

    worksContainer.innerHTML = '';

    songs.forEach(song => {
        const workCard = document.createElement('div');
        workCard.className = 'work-card';

        const imageContent = song.image.includes('.')
            ? `<img src="${song.image}" alt="${song.title}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`
            : song.image;

        workCard.innerHTML = `
            <div class="work-image">${imageContent}</div>
            <div class="work-title">${song.title}</div>
            <div class="work-description">${song.description}</div>
            <div class="work-price">${song.price} ₽</div>
            <audio class="work-audio" controls>
                <source src="${song.demo}" type="audio/mpeg">
                Ваш браузер не поддерживает аудио элемент.
            </audio>
            <button class="buy-button" onclick="buyWork('${song.code}', ${song.price})">
                💳 Оплатить
            </button>
        `;

        worksContainer.appendChild(workCard);
    });

    setTimeout(setupAllAudioControls, 100);
}

// === Инициализация при загрузке страницы ===
window.onload = function() {
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = '0';
        document.getElementById('menu').classList.add('active');

        autoPlayMusic();
        setupAllAudioControls();

        // Проверка успешной оплаты через URL
        const urlParams = new URLSearchParams(window.location.search);
        const successCode = urlParams.get("success");

        if (successCode) {
            const song = songs.find(s => s.code === successCode);
            if (song) {
                document.querySelector('.loader').style.opacity = '0';
                document.getElementById('menu').classList.remove('active');

                // Загружаем секцию find
                loadSection('find');

                // Показываем сообщение об успешной оплате
                setTimeout(() => {
                    document.getElementById('searchBox').style.display = 'none';
                    document.getElementById('successInfo').style.display = 'block';
                    document.getElementById('fullPlayer').src = song.full;
                    document.getElementById('downloadLink').href = song.full;

                    const fullPlayer = document.getElementById('fullPlayer');
                    setupAudioControl(fullPlayer);
                }, 300);
            }
        }
    }, 2000);
};
