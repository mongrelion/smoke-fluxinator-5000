(function () {
  const button = document.getElementById('smokeButton');
  const status = document.getElementById('status');
  const socket = io();

  let countdownInterval = null;

  button.addEventListener('click', () => {
    socket.emit('startSmoke');
  });

  socket.on('smokingState', (data) => {
    button.disabled = data.isActive;

    if (data.isActive) {
      startCountdown();
    } else {
      clearCountdown();
      status.textContent = '';
    }
  });

  socket.on('error', (data) => {
    alert(data.message);
  });

  function startCountdown() {
    let timeLeft = 10;
    status.innerHTML = `Smoking in progress... <span class="countdown">${timeLeft}s</span>`;

    countdownInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        status.innerHTML = `Smoking in progress... <span class="countdown">${timeLeft}s</span>`;
      } else {
        clearCountdown();
      }
    }, 1000);
  }

  function clearCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }
})();
