// API istekleri için ortak fonksiyon
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    // Token yoksa ve işlem token gerektiriyorsa, çağıran taraf yönlendirme yapmalı veya hata vermeli.
    // Bu fonksiyon token yoksa Authorization header'ı eklemez.
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers // Önce özel başlıklar, sonra Authorization overwrite edebilir.
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        // Token geçersiz veya süresi dolmuşsa login sayfasına yönlendir.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return null; // Yönlendirme sonrası bir şey döndürmemek için null.
    }
    
    return response;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Sunucu tarafında da bir logout endpoint'i varsa çağrılabilir:
    // fetch('/auth/logout', { method: 'POST' }); 
    window.location.href = '/auth/login'; // Giriş sayfasına yönlendir
}

// Tüm API isteklerini bu fonksiyon üzerinden yap
// Örnek kullanım:
// const response = await fetchWithAuth('/api/endpoint', { method: 'POST', body: JSON.stringify(data) }); 

// Sayfa yüklendiğinde kullanıcı arayüzünü güncelle
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let user = localStorage.getItem('user'); // let olarak tanımla, çünkü null olabilir
    const userSessionNavbar = document.getElementById('userSessionNavbar');

    if (!userSessionNavbar) {
        console.error("Element with ID 'userSessionNavbar' not found.");
        return; 
    }

    let userData = null;
    if (user) {
        try {
            userData = JSON.parse(user);
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            localStorage.removeItem('token'); // Bozuk veriyi temizle
            localStorage.removeItem('user');
            user = null; // Kullanıcıyı null yap, çıkış yapmış gibi davransın
        }
    }

    if (token && userData && userData.username) {
        // Kullanıcı giriş yapmış ve kullanıcı adı mevcut
        userSessionNavbar.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${userData.username}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
                    <li><a class="dropdown-item" href="/favorites">Favorilerim</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Çıkış Yap</a></li>
                </ul>
            </li>
        `;
    } else {
        // Kullanıcı giriş yapmamış veya kullanıcı bilgileri eksik/bozuk
        if (token || user) {
            // Tutarsız durum, token var ama user bilgisi yok/bozuk, temizle
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        userSessionNavbar.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/auth/login">Giriş Yap</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/auth/signup">Kayıt Ol</a>
            </li>
        `;
    }
}); 