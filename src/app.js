import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.use(express.json());

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un producto por su ID
app.get('/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        const product = await productManager.getProductsById(productId);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});