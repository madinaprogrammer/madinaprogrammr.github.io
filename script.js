// Получаем доступ к аудио-контексту
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Создаем анализатор громкости
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

// Получаем медиа-вход (микрофон)
navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
  })
  .catch((err) => {
    console.error('Ошибка доступа к микрофону:', err);
  });

// Получаем данные о громкости
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// Функция для обновления пламени в соответствии с громкостью
function updateFlame() {
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;

  // Определяем высоту пламени в зависимости от средней громкости
  const flameHeight = Math.max(10, average * 0.5);

  document.getElementById('flame').style.height = `${flameHeight}px`;

  // Запускаем следующее обновление через короткий интервал времени
  requestAnimationFrame(updateFlame);
}

// Запускаем обновление пламени
updateFlame();
