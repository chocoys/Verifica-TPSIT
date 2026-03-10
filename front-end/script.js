const API_URL = "https://verifica-tpsit.onrender.com";

// 1. Carica l'utente (Simuliamo l'utente con ID 1 per il compito)
async function caricaDati() {
    try {
        // Carica Utente
        const resUser = await fetch(`${API_URL}/user/1`);
        const user = await resUser.json();
        document.getElementById('user-name').innerText = user.name;
        document.getElementById('user-credits').innerText = user.credits;

        // Carica Prodotti
        const resProd = await fetch(`${API_URL}/products`);
        const products = await resProd.json();
        const container = document.getElementById('products-list');
        container.innerHTML = "";

        products.forEach(p => {
            container.innerHTML += `
                <div class="product">
                    <span><strong>${p.name}</strong> - ${p.price} Crediti (Disponibili: ${p.stock})</span>
                    <button onclick="acquista(${p.id})">Compra</button>
                </div>`;
        });
    } catch (e) { console.error("Errore caricamento:", e); }
}

// 2. Funzione Acquista (Invia dati al server)
async function acquista(productId) {
    const response = await fetch(`${API_URL}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: 1 }) // ID 1 fisso
    });

    const result = await response.json();
    if (response.ok) {
        alert("✅ " + result.message);
        caricaDati(); // Aggiorna i crediti e lo stock sulla pagina
    } else {
        alert("❌ Errore: " + result.error);
    }
}

// 3. Funzione Admin: Aggiungi Prodotto
async function aggiungiProdotto() {
    const name = document.getElementById('admin-p-name').value;
    const price = document.getElementById('admin-p-price').value;
    const stock = document.getElementById('admin-p-stock').value;

    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, stock })
    });

    alert("Prodotto aggiunto!");
    caricaDati(); // Ricarica la lista
}

// Avvio
caricaDati();
