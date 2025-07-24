const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// menu.json'u sun
app.get('/menu.json', (req, res) => {
  res.sendFile(__dirname + '/menu.json');
});

// menu.json'u güncelle
app.post('/menu-update', (req, res) => {
  fs.writeFile('menu.json', JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      return res.status(500).json({success: false, message: 'Kaydedilemedi'});
    }
    res.json({success: true, message: 'Menü başarıyla kaydedildi'});
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); 
