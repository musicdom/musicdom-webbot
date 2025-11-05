// Данные для песен и работ
const workerUrl = "https://musicdom-payment.vercel.app";

const songs = [
  { code: "456", title: "Песня Музыкальный Дом", price: 5 },
  { code: "123", title: "Песня для Максима", price: 200 }
];

// автоматическая подстановка путей
songs.forEach(song => {
  song.demo = `song/song${song.code}_demo.mp3`;
  song.full = `song/song${song.code}_full.mp3`;
});

const works = [
  {
    code: "456",
    title: "Песня-Музыкальный Дом",
    description: "Авторская композиция в стиле поп электронной музыки.",
    image: "logo.jpg",
    price: 100
  },
  {
    code: "123",
    title: "Песня для Максима",
    description: "Индивидуальный заказ для дня рождения. Лирическая баллада с акустической гитарой и фортепиано. Текст написан на основе личной истории заказчика.",
    image: "work2.jpg",
    price: 200
  },
  {
    code: "789",
    title: "Летний бриз",
    description: "Легкая летняя композиция в стиле инди-поп. Идеальна для плейлистов на лето, пляжный отдых или романтические вечера.",
    image: "work3.jpg",
    price: 150
  },
  {
    code: "321",
    title: "Городские огни",
    description: "Энергичный трек в стиле синти-поп, передающий атмосферу ночного мегаполиса. Содержит элементы электронной музыки 80-х.",
    image: "work4.jpg",
    price: 180
  }
];
