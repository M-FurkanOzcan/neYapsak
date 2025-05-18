const fs = require('fs');
const path = require('path');
const https = require('https');
const recipes = require('./sample_recipes.json');

// Resimlerin kaydedileceği klasör
const imageDir = path.join(__dirname, 'public', 'images', 'recipes');

// Klasör yoksa oluştur
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Her tarif için resmi indir
recipes.forEach(recipe => {
    const imageUrl = recipe.imageUrl;
    // Eğer URL http veya https ile başlıyorsa indir
    if (imageUrl.startsWith('http')) {
        const fileName = path.basename(imageUrl);
        const filePath = path.join(imageDir, fileName);
        
        // Dosya zaten varsa atla
        if (fs.existsSync(filePath)) {
            console.log(`${fileName} zaten mevcut, atlanıyor...`);
            return;
        }

        console.log(`${fileName} indiriliyor...`);
        
        https.get(imageUrl, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`${fileName} indirildi.`);
                });
            } else {
                console.error(`${fileName} indirilemedi. Hata kodu: ${response.statusCode}`);
            }
        }).on('error', (err) => {
            console.error(`${fileName} indirilirken hata oluştu:`, err.message);
        });
    }
}); 