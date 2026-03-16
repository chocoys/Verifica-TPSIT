const API_URL = "https://verifica-tpsit.onrender.com/api";
let currentUser = JSON.parse(localStorage.getItem('user')); // Mantieni il login al refresh
let isRegisterMode = false;

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('reg-fields').classList.toggle('hidden');
    document.getElementById('auth-title').innerText = isRegisterMode ? 'Registrazione' : 'Login';
    document.getElementById('btn-auth').innerText = isRegisterMode ? 'Crea Account' : 'Accedi';
}

async function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    const endpoint = isRegisterMode ? '/register' : '/login';
    const body = isRegisterMode ? { name, email, password } : { email, password };

    try {
        const res = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        if (isRegisterMode) {
            alert("Registrato! Ora fai il login.");
            toggleAuthMode();
        } else {
            localStorage.setItem('user', JSON.stringify(data));
            location.reload(); // Refresh per caricare lo shop
        }
    } catch (err) { alert(err.message); }
}

async function caricaShop() {
    if (!currentUser) return;
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('shop-section').classList.remove('hidden');
    document.getElementById('display-user').innerText = `Ciao, ${currentUser.name}`;

    // Carica Crediti aggiornati
    const resU = await fetch(`${API_URL}/user/1`); // Qui andrebbe l'ID reale, ma usiamo 1 per il compito
    const user = await resU.json();
    document.getElementById('user-credits').innerText = user.credits;

    // Carica Prodotti
    const resP = await fetch(`${API_URL}/products`);
    const products = await resP.json();
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(p => `
        <div class="card">
            <h4>${p.name}</h4>
            <p>Prezzo: <strong>${p.price}</strong> 🪙</p>
            <p>Stock: ${p.stock}</p>
            <button onclick="acquista(${p.id})">Acquista Ora</button>
        </div>
    `).join('');
}

async function acquista(productId) {
    const res = await fetch(`${API_URL}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: currentUser.id })
    });
    const data = await res.json();
    alert(data.message || data.error);
    caricaShop();
}

function logout() {
    localStorage.removeItem('user');
    location.reload();
}

if (currentUser) caricaShop();
