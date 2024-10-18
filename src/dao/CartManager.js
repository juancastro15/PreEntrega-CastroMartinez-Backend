const fs = require('fs');
const path = require('path');
const { getDirname } = require('../utils');

const cartsFilePath = path.join(getDirname(), 'src', 'data', 'carts.json');

class CartManager {
  constructor() {
    this.carts = [];
    this.loadCarts();
  }

  // Cargar carritos desde el archivo
  loadCarts() {
    if (fs.existsSync(cartsFilePath)) {
      const data = fs.readFileSync(cartsFilePath, 'utf-8');
      this.carts = JSON.parse(data);
    }
  }

  // Guardar carritos en el archivo
  saveCarts() {
    fs.writeFileSync(cartsFilePath, JSON.stringify(this.carts, null, 2));
  }

  // Crear nuevo carrito
  createCart() {
    const newCart = { id: this.carts.length + 1, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  // Obtener productos del carrito por ID de carrito
  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  // Agregar producto al carrito
  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const productInCart = cart.products.find(p => p.product === productId);
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      this.saveCarts();
      return cart;
    }
    return null;
  }
}

module.exports = CartManager;
