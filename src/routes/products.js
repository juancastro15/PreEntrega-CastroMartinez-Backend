const express = require('express');
const ProductManager = require('../dao/ProductManager');
const router = express.Router();

const productManager = new ProductManager();

// Obtener todos los productos (con limit opcional)
router.get('/', (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getAll(limit);
  res.json(products);
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
  const product = productManager.getById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar nuevo producto
router.post('/', (req, res) => {
  const newProduct = productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Actualizar producto por ID
router.put('/:pid', (req, res) => {
  const updatedProduct = productManager.updateProduct(parseInt(req.params.pid), req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar producto por ID
router.delete('/:pid', (req, res) => {
  const deletedProduct = productManager.deleteProduct(parseInt(req.params.pid));
  if (deletedProduct) {
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
