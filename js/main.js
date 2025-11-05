// Основная логика приложения
let currentSection = null;

// Загрузка разделов
async function loadSection(sectionId) {
  try {
    const response = await fetch(`sections/${sectionId}.html`);
    const html = await response.text();
    
    const container = document.getElementById('sections-container');
    container.innerHTML = html;
    
    // Если загружаем раздел works, рендерим карточки
    if (sectionId === 'works') {
      setTimeout(() => {
        renderWorks();
      }, 100);
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка загрузки раздела:', error);
    return false;
  }
}

// Открытие раздела
async function openSection(id) {
  document.getElementById('menu').classList.remove('active');
  
  // Скрываем текущий раздел
  if (currentSection) {
    document.getElementById(currentSection).classList.remove('active');
  }
  
  // Загружаем и показываем новый раздел
  const success = await loadSection(id);
  if (success) {
    currentSection = id;
    document.getElementById(id).classList.add('active');
  }
}

// Назад в меню
function goBack() {
  if (currentSection) {
    document.getElementById(currentSection).classList.remove('active');
    currentSection = null;
  }
  document.getElementById('menu').classList.add('active');
}

// Проверка URL-параметра success (после оплаты)
const urlParams = new URLSearchParams(window.location.search);
const successCode = urlParams.get("success");
if (successCode) {
  const song = songs.find(s => s.code === successCode);
  if (song) {
    document.querySelector('.loader').style.opacity = '0';
    document.getElementById('menu').classList.remove('active');
    
    // Загружаем раздел find и показываем успешную оплату
    loadSection('find').then(() => {
      document.getElementById('find').classList.add('active');
      document.getElementById('searchBox').style.display = 'none';
      document.getElementById('successInfo').style.display = 'block';
      document.getElementById('fullPlayer').src = song.full;
      document.getElementById('downloadLink').href = song.full;
      currentSection = 'find';
    });
  }
}

// Инициализация при загрузке
window.onload = function() {
  setTimeout(() => {
    document.querySelector('.loader').style.opacity = '0';
    document.getElementById('menu').classList.add('active');
  }, 2000);
};

// Очистка URL параметров при навигации
function cleanUrl() {
  history.pushState({}, "", window.location.pathname);
}
