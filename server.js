const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// HTML ve statik dosyaların sunulacağı klasör
app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
  console.log('Bir oyuncu bağlandı:', socket.id);

  // Oyuncu konum ve durum bilgisi
  socket.on('presence', (data) => {
    players[socket.id] = data;
    socket.broadcast.emit('update_players', players);
  });

  // Ateş etme (mermi) sinyali
  socket.on('shot', (data) => {
    socket.broadcast.emit('shot', data);
  });

  // Sandık açılma sinyali
  socket.on('chest', (data) => {
    socket.broadcast.emit('chest', data);
  });

  // Oyuncu ayrıldığında
  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('update_players', players);
    console.log('Oyuncu ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});