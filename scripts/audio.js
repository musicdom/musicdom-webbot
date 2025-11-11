// Переменные для управления музыкой
let isBackgroundMusicPlaying = false;
let wasBackgroundMusicPlaying = false;

// Функция для показа уведомления о музыке
function showMusicNotification(message) {
    const existingNotification = document.querySelector('.music-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'music-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Функция переключения музыки
function toggleMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    backgroundMusic.volume = 0.3;
    
    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            musicToggle.textContent = '🎵';
            isBackgroundMusicPlaying = true;
            showMusicNotification('Музыка включена 🎵');
        }).catch(error => {
            console.log('Ошибка воспроизведения:', error);
            showMusicNotification('Ошибка воспроизведения 😢');
        });
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = '🔇';
        isBackgroundMusicPlaying = false;
        showMusicNotification('Музыка выключена 🔇');
    }
}

// Функция для автоматического включения музыки
function autoPlayMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    backgroundMusic.volume = 0.3;
    
    backgroundMusic.play().then(() => {
        musicToggle.textContent = '🎵';
        isBackgroundMusicPlaying = true;
    }).catch(error => {
        console.log('Автовоспроизведение заблокировано. Пользователь должен включить музыку вручную.');
        musicToggle.textContent = '🔇';
        isBackgroundMusicPlaying = false;
    });
}

// Функция для управления фоновой музыкой при воспроизведении других аудио
function setupAudioControl(audioElement) {
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    audioElement.addEventListener('play', function() {
        if (isBackgroundMusicPlaying) {
            backgroundMusic.pause();
            wasBackgroundMusicPlaying = true;
        }
    });

    audioElement.addEventListener('pause', function() {
        if (wasBackgroundMusicPlaying && !this.ended) {
            backgroundMusic.play();
            wasBackgroundMusicPlaying = false;
        }
    });

    audioElement.addEventListener('ended', function() {
        if (wasBackgroundMusicPlaying) {
            backgroundMusic.play();
            wasBackgroundMusicPlaying = false;
        }
    });
}

// Функция для настройки контроля аудио на всех элементах
function setupAllAudioControls() {
    const allAudioElements = document.querySelectorAll('audio:not(#backgroundMusic)');
    allAudioElements.forEach(audio => {
        setupAudioControl(audio);
    });
}
