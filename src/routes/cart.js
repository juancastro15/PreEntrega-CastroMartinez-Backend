const express = require('express');
const CartManager = require('../dao/CartManager');
const router = express.Router();

const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener carrito por ID
router.get('/:cid', (req, res) => {
  const cart = cartManager.getCartById(parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const updatedCart = cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;
