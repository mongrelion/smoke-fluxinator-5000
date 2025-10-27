// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuration
const SMOKE_MACHINE_START_URL = 'http://your-smoke-machine-ip/start';
const SMOKE_MACHINE_STOP_URL = 'http://your-smoke-machine-ip/stop';
const CYCLE_DURATION = 10000; // 10 seconds

let isSmokingActive = false;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');

  // Send current state to newly connected client
  socket.emit('smokingState', { isActive: isSmokingActive });

  socket.on('startSmoke', async () => {
    if (isSmokingActive) {
      socket.emit('error', { message: 'Smoke cycle already in progress' });
      return;
    }

    isSmokingActive = true;

    // Notify all clients to disable the button
    io.emit('smokingState', { isActive: true });

    try {
      // Start the smoke machine
      await axios.post(SMOKE_MACHINE_START_URL);
      console.log('Smoke started');

      // Wait for 10 seconds
      setTimeout(async () => {
        try {
          // Stop the smoke machine
          await axios.post(SMOKE_MACHINE_STOP_URL);
          console.log('Smoke stopped');
        } catch (error) {
          console.error('Error stopping smoke:', error);
        }

        isSmokingActive = false;

        // Notify all clients to enable the button
        io.emit('smokingState', { isActive: false });
      }, CYCLE_DURATION);

    } catch (error) {
      console.error('Error starting smoke:', error);
      isSmokingActive = false;
      io.emit('smokingState', { isActive: false });
      socket.emit('error', { message: 'Failed to start smoke machine' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
