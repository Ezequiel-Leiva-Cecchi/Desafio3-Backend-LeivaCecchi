import { promises as fs } from "fs";

export default class ProductManager {
    constructor() {
        this.patch = "./products.txt";
        this.products = [];
        this.id = 0;
        this.initializeProducts(); 
    }

    // Método para agregar un producto.
    addProduct = async (title, description, price, stock, code, image) => {
        // Validar que todos los campos estén presentes.
        if (!title || !description || !price || !stock || !code || !image) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        // Validar que el código del producto sea único.
        if (this.products.some(product => product.code === code)) {
            console.log("Ya existe un producto con este código");
            return;
        }

        // Incrementar el ID para obtener uno único.
        this.id++;

        // Crear un nuevo objeto de producto.
        const newProduct = {
            title,
            description,
            price,
            stock,
            code,
            image,
            id: this.id
        };

        // Agregar el nuevo producto a la lista.
        this.products.push(newProduct);

        // Escribir la lista de productos en el archivo.
        await fs.writeFile(this.patch, JSON.stringify(this.products));
    };

    // Método para inicializar productos.
    initializeProducts = async () => {
        try {
            // Intentar leer el contenido del archivo.
            const content = await fs.readFile(this.patch, "utf-8");

            // Parsear el contenido del archivo como JSON.
            this.products = content.trim() ? JSON.parse(content) : [];

            // Obtener el último ID para continuar con la asignación de IDs.
            const lastProduct = this.products[this.products.length - 1];
            this.id = lastProduct ? lastProduct.id : 0;
        } catch (error) {
            console.error("Error al leer o analizar el archivo:", error.message);
        }
    };

      // Método para obtener la lista completa de productos.
      getAllProducts = async (limit) => {
        try {
            if (limit) {
                return this.products.slice(0, limit);
            } else {
                return this.products;
            }
        } catch (error) {
            throw new Error("Error al obtener la lista de productos: " + error.message);
        }
    };
    // Método para obtener un producto por su ID.
    getProductsById = async (id) => {
        // Obtener el producto con el ID proporcionado.
        const foundProduct = this.products.find(product => product.id === id);

        if (!foundProduct) {
            console.log("No se logró encontrar ningún producto");
        } else {
            console.log(foundProduct);
            return foundProduct;
        }
    };

    // Método para obtener la lista completa de productos.
    getProducts = async () => {
        return this.products;
    };

    // Método para eliminar un producto por su ID.
    deleteProductsById = async (id) => {
        // Encontrar el índice del producto con el ID proporcionado.
        const index = this.products.findIndex(product => product.id === id);

        if (index === -1) {
            console.log("No se logró encontrar el producto para eliminar");
            return;
        } else {
            // Eliminar el producto de la lista.
            this.products.splice(index, 1);

            // Escribir la lista actualizada en el archivo.
            await fs.writeFile(this.patch, JSON.stringify(this.products));
            console.log("Producto eliminado");
        }
    };

    // Método para actualizar un producto por su ID.
    updateProducts = async (updatedFiles) => {
        // Validar que se proporcione el ID del producto a actualizar.
        if (!updatedFiles.id) {
            console.log("Se debe proporcionar el ID del producto a actualizar");
            return;
        }

        // Encontrar el índice del producto con el ID proporcionado.
        const index = this.products.findIndex(product => product.id === updatedFiles.id);

        if (index === -1) {
            console.log("No se logró encontrar el producto para actualizar");
            return;
        }

        // Validar que el nuevo código (si se proporciona) sea único.
        if (updatedFiles.code && this.products.some(product => product.code === updatedFiles.code)) {
            console.log("Ya existe un producto con este código");
            return;
        }

        // Actualizar los campos del producto encontrado.
        this.products[index] = { ...this.products[index], ...updatedFiles };

        // Escribir la lista actualizada en el archivo.
        await fs.writeFile(this.patch, JSON.stringify(this.products));
        console.log("Producto actualizado");
    };
}