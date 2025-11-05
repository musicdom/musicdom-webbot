// Функция для покупки работы
function buyWork(code, price) {
  window.open(`${workerUrl}/?code=${code}&price=${price}`, '_blank');
}

// Функция для поиска песни
function findSong() {
  const code = document.getElementById('songCode').value.trim();
  const song = songs.find(s => s.code === code);
  if (!song) return alert("Песня с таким кодом не найдена 😢");

  document.getElementById('songInfo').style.display = 'block';
  document.getElementById('songTitle').textContent = song.title;
  document.getElementById('demoPlayer').src = song.demo;

  document.getElementById('buySection').innerHTML = `
    <p>Цена: ${song.price}₽</p>
    <a href="${workerUrl}/?code=${song.code}&price=${song.price}" target="_blank">
      <button>💳 Оплатить</button>
    </a>
  `;
}

// Функция для отображения карточек работ с анимацией
function renderWorks() {
  const container = document.getElementById('worksContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  works.forEach((work, index) => {
    const workCard = document.createElement('div');
    workCard.className = 'work-card';
    
    // Добавляем задержку для анимации появления
    workCard.style.animationDelay = `${index * 0.1}s`;
    
    workCard.innerHTML = `
      <img src="${work.image}" alt="${work.title}" class="work-image">
      <h3 class="work-title">${work.title}</h3>
      <p class="work-description">${work.description}</p>
      <audio controls class="work-audio">
        <source src="song/song${work.code}_demo.mp3" type="audio/mpeg">
        Ваш браузер не поддерживает аудио элементы.
      </audio>
      <div class="work-price">Цена: ${work.price}₽</div>
      <button class="buy-button" onclick="buyWork('${work.code}', ${work.price})">💳 Купить полную версию</button>
    `;
    
    container.appendChild(workCard);
  });
}
