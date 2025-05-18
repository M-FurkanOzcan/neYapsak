# NeYapsak - Eldeki Malzemelerle Yemek Tarifleri

NeYapsak, kullanıcıların evde bulunan malzemelere göre yemek tariflerini bulmalarını sağlayan bir web uygulamasıdır. Kullanıcılar, evlerinde bulunan malzemeleri sisteme girerek, bu malzemelerle yapabilecekleri tarifleri keşfedebilirler.

## Özellikler

- Malzemelere göre tarif arama
- Tarif detaylarını görüntüleme
- Yeni tarif ekleme
- Tariflere yorum yapma
- Tarifleri favorilere ekleme
- Responsive tasarım

## Teknolojiler

- Node.js
- Express.js
- MongoDB (Mongoose)
- EJS Template Engine
- Bootstrap 5
- JavaScript

## Kurulum

Bu uygulamayı yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Repoyu klonlayın:

```
git clone https://github.com/kullaniciadi/neyapsak.git
cd neyapsak
```

2. Bağımlılıkları yükleyin:

```
npm install
```

3. Veritabanı bağlantısını yapılandırın:

- MongoDB'yi yerel ortamınızda kurun veya MongoDB Atlas ile bir veritabanı oluşturun.
- `app.js` dosyasındaki MongoDB connection string'i güncelleyin.

4. Uygulamayı başlatın:

```
npm run dev
```

5. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyin.

## Kullanım

1. Ana sayfadaki arama kutusuna malzemeleri virgülle ayırarak girin.
2. "Tarif Bul" butonuna tıklayın.
3. Girdiğiniz malzemelerle yapabileceğiniz tarifleri inceleyin.
4. Tarif detaylarını görmek için tariflerin üzerine tıklayın.
5. Kendi tariflerinizi eklemek için "Tarif Ekle" butonunu kullanın.

## Projeyi Geliştirme

Bu proje açık kaynak kodludur ve katkılara açıktır. Projeye katkıda bulunmak isterseniz:

1. Bu repoyu forklayın
2. Değişikliklerinizi yapın
3. Pull request gönderin

## Lisans

Bu proje [ISC Lisansı](https://opensource.org/licenses/ISC) altında lisanslanmıştır.
