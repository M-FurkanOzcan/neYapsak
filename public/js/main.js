// API istekleri için ortak fonksiyon
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/login';
        return; // Return undefined if no token, to be handled by caller
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        // Token geçersiz veya süresi dolmuş
        //deneme
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return; // Return undefined if unauthorized, to be handled by caller
    }
    
    return response;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Gerekirse sunucuya da logout isteği gönderilebilir
    // fetch('/auth/logout', { method: 'POST' }); 
    window.location.href = '/auth/login';
}

// Sayfa yüklendiğinde kullanıcı arayüzünü güncelle
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userSessionNavbar = document.getElementById('userSessionNavbar');

    if (!userSessionNavbar) return; // Eğer navbar elementi yoksa bir şey yapma

    if (token && user) {
        // Kullanıcı giriş yapmış
        try {
            const userData = JSON.parse(user);
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
        } catch (error) {
            console.error('Kullanıcı bilgileri ayrıştırılırken hata:', error);
            // Hata durumunda kullanıcıyı çıkış yapmış gibi göster
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            userSessionNavbar.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/auth/login">Giriş Yap</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/auth/signup">Kayıt Ol</a>
                </li>
            `;
        }
    } else {
        // Kullanıcı giriş yapmamış
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