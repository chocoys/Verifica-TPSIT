import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 1. GET CATALOGO PRODOTTI
app.get('/api/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json(error);
    res.json(data);
});

// 2. GET SALDO UTENTE (Simuliamo utente con ID 1)
app.get('/api/user/1', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', 1).single();
    if (error) return res.status(500).json(error);
    res.json(data);
});

// 3. LOGICA DI ACQUISTO (Punto cruciale per il 10)
app.post('/api/buy', async (req, res) => {
    const { productId, userId } = req.body;

    // Recupera prodotto e utente
    const { data: product } = await supabase.from('products').select('*').eq('id', productId).single();
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();

    // CONTROLLI LATO SERVER (Obbligatori nel compito)
    if (product.stock <= 0) return res.status(400).json({ error: "Prodotto esaurito!" });
    if (user.credits < product.price) return res.status(400).json({ error: "Crediti insufficienti!" });

    // Esegui transazione (riduci stock e scala crediti)
    await supabase.from('products').update({ stock: product.stock - 1 }).eq('id', productId);
    await supabase.from('users').update({ credits: user.credits - product.price }).eq('id', userId);

    res.json({ message: "Acquisto completato!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server E-Commerce pronto sulla porta ${PORT}`));
