const express = require('express');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;