const jwt_simple = require('jwt-simple');
const moment = require('moment');
const claveSecreta = 'claveS123'

exports.crearToken = function (usuarios) {
    let payload = {
        sub: usuarios._id,
        nombre: usuarios.nombre,
        email: usuarios.email,
        password: usuarios.password,
        rol: usuarios.rol,
        iat: moment().unix(),
        exp: moment().day(7, 'days').unix()
            
    }
    
    return jwt_simple.encode(payload, claveSecreta);    

}