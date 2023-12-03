import express from 'express';
import ProductManager from './Components/ProductManager';

const app = express();
const PORT = 8080;

// Instanciar la clase ProductManager
const productManager = new ProductManager();

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();
    
    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

// Ruta para obtener un producto por su ID
app.get('/products/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = await productManager.getProductsById(productId);

    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        res.json(product);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});