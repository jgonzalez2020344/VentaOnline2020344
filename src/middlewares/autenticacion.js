const jwt_simple = require('jwt-simple');
const moment = require('moment');
const claveSecreta = "claveS123"

exports.Auth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(500).send({mensaje: 'La peticion no tiene la cabecera de autenticación'})
    }
        
    var token = req.headers.authorization.replace(/['"]+/g, '');
    
    try{
        var payload = jwt_simple.decode(token, claveSecreta);
        if(payload.exp <= moment().unix()){
            return res.status(500).send({mensaje: 'El token ha expirado'});
        }
    } catch (error) {
        return res.status(500).send({mensaje: 'El token no es valido'});
    }

    req.user = payload;
    next();
}

exports.rol = (req, res, next) => {
    var parametros = req.user;
    if (parametros.rol != 'ADMIN') {
        return res.status(500).send({mensaje: 'No tiene acceso'})
    } else {
        return next();
    }
}