const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
  })
  .catch((err) => {
    console.error('Ошибка доступа к микрофону:', err);
  });

const dataArray = new Uint8Array(analyser.frequencyBinCount);

function updateFlame() {
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;

  const flameHeight = Math.max(10, average * 0.5);
  document.getElementById('flame').style.height = `${flameHeight}px`;

  requestAnimationFrame(updateFlame);
}

updateFlame();
