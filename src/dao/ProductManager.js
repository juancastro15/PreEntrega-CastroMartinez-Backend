const fs = require('fs');
const path = require('path');
const { getDirname } = require('../utils');

const productsFilePath = path.join(getDirname(), 'src', 'data', 'products.json');

class ProductManager {
  constructor() {
    this.products = [];
    this.loadProducts();
  }

  // Cargar productos desde el archivo
  loadProducts() {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf-8');
      this.products = JSON.parse(data);
    }
  }

  // Guardar productos en el archivo
  saveProducts() {
    fs.writeFileSync(productsFilePath, JSON.stringify(this.products, null, 2));
  }

  // Listar todos los productos (con opción de limit)
  getAll(limit) {
    return limit ? this.products.slice(0, limit) : this.products;
  }

  // Obtener producto por ID
  getById(id) {
    return this.products.find(product => product.id === id);
  }

  // Agregar nuevo producto
  addProduct(product) {
    const newProduct = {
      id: this.products.length + 1,
      ...product,
      status: true,
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Actualizar producto por ID
  updateProduct(id, updates) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updates };
      this.saveProducts();
      return this.products[productIndex];
    }
    return null;
  }

  // Eliminar producto por ID
  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1);
      this.saveProducts();
      return deletedProduct;
    }
    return null;
  }
}

module.exports = ProductManager;