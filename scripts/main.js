// Глобальные переменные
let currentSection = null;

// Функция открытия раздела
function openSection(id) {
    if (currentSection === id) return;
    
    document.getElementById('menu').classList.remove('active');
    
    // Скрываем текущую секцию
    if (currentSection) {
        const currentSectionEl = document.getElementById(currentSection);
        if (currentSectionEl) {
            currentSectionEl.classList.remove('active');
        }
    }
    
    // Показываем новую секцию
    const section = document.getElementById(id);
    if (section) {
        section.classList.add('active');
        currentSection = id;
        
        // Специальная инициализация для некоторых секций
        if (id === 'works') {
            setTimeout(renderWorks, 100);
        }
    }
}

// Функция возврата в меню
function goBack() {
    if (currentSection) {
        const currentSectionEl = document.getElementById(currentSection);
        if (currentSectionEl) {
            currentSectionEl.classList.remove('active');
        }
        currentSection = null;
    }
    document.getElementById('menu').classList.add('active');
}

// Функция для поиска песни
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

// Функция для покупки работы
function buyWork(code, price) {
    window.open(`${workerUrl}/?code=${code}&price=${price}`, '_blank');
}

// Функция для покупки плана
function buyPlan(plan, price) {
    window.open(`${workerUrl}/?plan=${encodeURIComponent(plan)}&planPrice=${price}`, '_blank');
}

// Функция для отображения работ
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

// Загрузка секций
function loadSections() {
    const sections = ['find', 'works', 'price', 'about'];
    const container = document.getElementById('sections-container');
    
    sections.forEach(section => {
        fetch(`sections/${section}.html`)
            .then(response => response.text())
            .then(html => {
                container.innerHTML += html;
            })
            .catch(error => {
                console.error(`Ошибка загрузки секции ${section}:`, error);
            });
    });
}

// Инициализация при загрузке
window.onload = function() {
    // Сначала загружаем секции
    loadSections();
    
    // Затем инициализируем приложение
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = '0';
        document.getElementById('menu').classList.add('active');
        
        // Пытаемся автоматически включить музыку после загрузки
        autoPlayMusic();
        
        // Настраиваем контроль аудио для всех существующих элементов
        setTimeout(setupAllAudioControls, 500);
        
        // Проверяем URL-параметр success (после оплаты)
        const urlParams = new URLSearchParams(window.location.search);
        const successCode = urlParams.get("success");
        
        if (successCode) {
            const song = songs.find(s => s.code === successCode);
            if (song) {
                document.querySelector('.loader').style.opacity = '0';
                document.getElementById('menu').classList.remove('active');
                
                // Ждем немного чтобы секция успела загрузиться
                setTimeout(() => {
                    const findSection = document.getElementById('find');
                    if (findSection) {
                        findSection.classList.add('active');
                        currentSection = 'find';
                        document.getElementById('searchBox').style.display = 'none';
                        document.getElementById('successInfo').style.display = 'block';
                        document.getElementById('fullPlayer').src = song.full;
                        document.getElementById('downloadLink').href = song.full;

                        setTimeout(() => {
                            const fullPlayer = document.getElementById('fullPlayer');
                            setupAudioControl(fullPlayer);
                        }, 100);
                    }
                }, 300);
            }
        }
    }, 2000);
};
