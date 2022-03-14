const mongoose = require('mongoose');
const app = require('./app');
const {registrarAdmin} = require('./src/controllers/usuarios.controllers');
const {categoriaDefault} = require('./src/controllers/categorias.controllers');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline2020344', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se ha conectado correctamente a la base de datos.');

    app.listen(3000, function (){
        console.log("Servidor de Express corriendo correctamente en el puerto 3000");
    });

}).catch(error => console.log(error));

registrarAdmin();
categoriaDefault();