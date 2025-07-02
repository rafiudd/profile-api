import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import cors from 'cors';

// Membuat instance aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path file JSON
const portfolioFilePath = path.join('data', 'portfolio.json');
const messagesFilePath = path.join('data', 'messages.json');

// Route untuk mendapatkan data portofolio
app.get('/portfolio', (req, res) => {
  fs.readJson(portfolioFilePath)
    .then((portfolioData) => {
      res.status(200).json(portfolioData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data portofolio.' });
    });
});

// Route untuk mengirim pesan dari halaman kontak
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };

  // Menyimpan pesan ke dalam file JSON
  fs.readJson(messagesFilePath)
    .then((messages) => {
      messages.push(newMessage); // Menambahkan pesan baru
      return fs.writeJson(messagesFilePath, messages); // Menulis ulang ke file
    })
    .then(() => {
      res.status(201).json({ success: true, message: 'Pesan berhasil dikirim!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengirim pesan.' });
    });
});

// Route untuk menambahkan data portofolio (Bonus: CRUD sederhana)
app.post('/portfolio', (req, res) => {
  const { title, description, url } = req.body;

  const newPortfolioItem = {
    id: Date.now(),
    title,
    description,
    url,
    timestamp: new Date().toISOString(),
  };

  fs.readJson(portfolioFilePath)
    .then((portfolioData) => {
      portfolioData.push(newPortfolioItem);
      return fs.writeJson(portfolioFilePath, portfolioData);
    })
    .then(() => {
      res.status(201).json({ success: true, message: 'Portofolio berhasil ditambahkan!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menambah data portofolio.' });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
