const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Resim boyutları
const width = 800;
const height = 600;

// Canvas oluştur
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Arka plan rengi
ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, width, height);

// Metin
ctx.fillStyle = '#666666';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Resim Yükleniyor', width / 2, height / 2);

// Resmi kaydet
const out = fs.createWriteStream(path.join(__dirname, 'public', 'images', 'placeholder.jpg'));
const stream = canvas.createJPEGStream({
    quality: 0.95,
    chromaSubsampling: false
});

stream.pipe(out);
out.on('finish', () => console.log('Placeholder resmi oluşturuldu.')); 