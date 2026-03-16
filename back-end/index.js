import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// --- AUTHENTICATION ---

// REGISTRAZIONE
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase.from('users')
        .insert([{ name, email, password: hashedPassword, credits: 100, is_admin: false }]);

    if (error) return res.status(400).json({ error: "Email già registrata" });
    res.json({ message: "Registrazione completata! Ora puoi loggare." });
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

    if (error || !user) return res.status(401).json({ error: "Utente non trovato" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Password errata" });

    // Ritorna l'utente senza la password per sicurezza
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// --- SHOP LOGIC ---

app.get('/api/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select('*').order('name');
    res.json(data || []);
});

app.post('/api/buy', async (req, res) => {
    const { productId, userId } = req.body;

    const { data: product } = await supabase.from('products').select('*').eq('id', productId).single();
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();

    if (!product || product.stock <= 0) return res.status(400).json({ error: "Esaurito" });
    if (!user || user.credits < product.price) return res.status(400).json({ error: "Crediti insufficienti" });

    await supabase.from('products').update({ stock: product.stock - 1 }).eq('id', productId);
    await supabase.from('users').update({ credits: user.credits - product.price }).eq('id', userId);

    res.json({ message: "Acquisto riuscito!" });
});

app.listen(process.env.PORT || 3000, () => console.log("Security Server Online"));