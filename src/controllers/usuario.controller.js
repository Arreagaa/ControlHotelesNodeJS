const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const usuarioModel = require('../models/usuario.model');

// BUSQUEDAS
function ObtenerClientes (req, res) {

    Usuarios.find((err, ClientesObtenidos) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ usuarios: ClientesObtenidos })
    })
}

function ObtenerClienteId(req, res){
    var idCliente = req.params.idCliente

    Usuarios.findById(idCliente,(err,clienteEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!clienteEncontrado) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ usuarios: clienteEncontrado });
    })
}

//LOGIN
function login(req,res){
    var paramentros = req.body;

    Usuarios.findOne({email: paramentros.email},(err,usuarioGuardado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'})
        if(usuarioGuardado){
            bcrypt.compare(paramentros.password,usuarioGuardado.password,(err,verificacionPassword)=>{
                if(verificacionPassword){
                    if(paramentros.obtenerToken === 'true'){
                        return res.status(200).send({
                            token: jwt.crearToken(usuarioGuardado)
                        })
                    }else{
                        usuarioGuardado.password = undefined;
                        return res.status(200).send({usuario: usuarioGuardado})
                    }
                }else{
                    return res.status(500).send({mensaje:'La contrasena no coincide'})
                }
            })
        }else{
            return res.status(500).send({mensaje: 'El usuario no se encuentra o no se identifica'})
        }
    })
}

//AGREGAR ADMIN -- AL INSTANTE
function RegistrarAdmin(req, res){
    var usuariosModel = new Usuarios();   
    usuariosModel.nombre = 'superAdmin';
    usuariosModel.email = 'Admin@gmail.com';
    usuariosModel.direccion = '6A Avenida 13-54';
    usuariosModel.pais = 'Guatemala';
    usuariosModel.rol = 'ROL_ADMINISTRADOR';

    Usuarios.find({ nombre: 'superAdmin', email: 'Admin@gmail.com'}, (err, usuarioEncontrato) => {
        if (usuarioEncontrato.length == 0) {
            bcrypt.hash("123456",null, null, (err, passswordEncypt) => { 
                usuariosModel.password = passswordEncypt
                usuariosModel.save((err, usuarioGuardado) => {
                console.log(err)
                })
            })
        } else {
            console.log('Este usuario con el puesto de Administrador ya esta creado')
        }
    })
}

function registrarCliente(req, res){
    var parametros = req.body;
    var usuariosModel = new Usuarios();
  
    if(parametros.nombre, parametros.email, parametros.direccion, parametros.pais){
        usuariosModel.nombre = parametros.nombre;
        usuariosModel.email =  parametros.email;
        usuariosModel.direccion = parametros.direccion;
        usuariosModel.pais = parametros.pais;
        usuariosModel.rol = 'ROL_CLIENTE';
        usuarioModel.idHotel = parametros.idHotel;
            Usuarios.find({nombre: parametros.nombre}
                ,(err, usuarioGuardado)=>{
                if(usuarioGuardado.length == 0){
                    bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, usGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!usGuardado) return res.status(404).send({mensaje: 'No se agrego el cliente'});
  
                            return res.status(201).send({usuarios: usGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
    }else{
        return res.status(500).send({ mensaje: 'Error en la peticion agregar' });
    }
}


//EDITAR PERFIL DEL USUARIO
function EditarClientePerfil(req, res){
    var idUsuario = req.params.idUsuario;
    var paramentros = req.body;
    
        Usuarios.findByIdAndUpdate({_id: idUsuario}, paramentros,{new:true},(err, clientePerfilEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!clientePerfilEditado) return res.status(400).send({mensaje: 'No se puedo editar el perfil de usuario'});
                
                return res.status(200).send({usuarios: clientePerfilEditado});
            })

}

//ELIMINAR PERFIL DEL USUARIO
function EliminarClientePerfil(req, res){
    var idUsuario = req.params.idUsuario;

    Usuarios.findByIdAndDelete({_id: idUsuario},(err, clientePerfilEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!clientePerfilEliminado) return res.status(400).send({mensaje: 'No se puedo eliminar el perfil de usuario'});
                
            return res.status(200).send({usuarios: clientePerfilEliminado});
    })
}

/*ADMINISTRACION CLIENTES*/
//EDITAR ROL Y TRABAJO DEL USUARIO
function EditarClienteRol(req, res){
    var idUsuario = req.params.idUsuario;
    var paramentros = req.body;
    
        Usuarios.findByIdAndUpdate({_id: idUsuario}, paramentros,{new:true},(err, clientePerfilEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!clientePerfilEditado) return res.status(400).send({mensaje: 'No se puedo editar el perfil de usuario'});
                
                return res.status(200).send({usuarios: clientePerfilEditado});
            })

}


module.exports = {
    login,
    RegistrarAdmin,
    ObtenerClientes,
    registrarCliente,
    ObtenerClienteId,
    EditarClientePerfil,
    EliminarClientePerfil,
    EditarClienteRol
}