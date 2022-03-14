const express = require('express');
const cors = require('cors');
const app = express();

const usuariosRoutes = require('./src/routes/usuarios.routes');
const categoriasRoutes = require('./src/routes/categorias.routes');
const productosRoutes = require('./src/routes/productos.routes');
const carritoRoutes = require('./src/routes/carrito.routes');
const facturasRoutes = require('./src/routes/facturas.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/api', usuariosRoutes, categoriasRoutes, productosRoutes, carritoRoutes, facturasRoutes);

module.exports = app;