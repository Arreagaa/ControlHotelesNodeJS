const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Servicios = require('../models/servicio.model');
const Usuario = require('../models/usuario.model')

function ObtenerServicios (req, res) {

   /* Servicios.find((err, serviciosObtenidos) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ servicios: serviciosObtenidos })
    })*/

    var idHotel = req.params.idHotel;

    if(req.user.rol == 'ROL_CLIENTE'){
        
        Servicios.find({idHotel: idHotel}, (err, serviciosObtenidos)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!serviciosObtenidos) return res.status(404).send({mensaje : "Error, no se encuentran habitaciones en dicho Hotel."});

            return res.status(200).send({servicios: serviciosObtenidos});
        }).populate('idHotel')

    }else if(req.user.rol == 'ROL_HOTEL'){
        Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
            if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
            if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

            Servicios.find({idHotel: usuarioEncontrado.idHotel}, (err, serviciosObtenidos)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion el id"});
                if(!serviciosObtenidos) return res.status(404).send({mensaje : "Error, no se encuentran habitaciones en dicho Hotel."});
        
                return res.status(200).send({servicios: serviciosObtenidos});
            })
        })
    }
}

function ObtenerServicioId(req, res){
    var idServicio = req.params.idServicio

    Servicios.findById(idServicio,(err, servicioEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!servicioEncontrado) return res.status(404).send( { mensaje: 'Error al obtener el servicio' });

        return res.status(200).send({ servicios: servicioEncontrado });
    })
}

function agregarServicio(req, res){
    var parametros = req.body;
    var servicioModel = new Servicios();
  
    if(parametros.servicio, parametros.precio){
        servicioModel.servicio = parametros.servicio;
        servicioModel.precio = parametros.precio;
        servicioModel.idHotel = parametros.idHotel;
            Servicios.find({servicio: parametros.servicio}
                ,(err, servicioGuardado)=>{
                if(servicioGuardado.length == 0){
                    servicioModel.save((err, serviciosGuardados) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!serviciosGuardados) return res.status(404).send({mensaje: 'No se agrego el servicio'});
  
                            return res.status(201).send({servicios: serviciosGuardados});
                         })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Error en la peticion agregar' });
        }
}

function editarServicio(req, res){
    var idServicio = req.params.idServicio;
    var paramentros = req.body;

    Servicios.findByIdAndUpdate({_id: idServicio, servicio: paramentros.servicio}, paramentros,{new:true},
        (err, servicioEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!servicioEditado) return res.status(400).send({mensaje: 'No se puede editar el servicio'});
                
            return res.status(200).send({servicios: servicioEditado});
    })
}

function eliminarServicio(req, res){
    var idServicio = req.params.idServicio;

    Servicios.findByIdAndDelete({_id: idServicio},(err, servicioEliminado)=>{
                
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!servicioEliminado) return res.status(400).send({mensaje: 'No es puede eliminar el servicio'});
                
            return res.status(200).send({servicios: servicioEliminado});
        })
}


module.exports = {
    agregarServicio,
    editarServicio,
    eliminarServicio,
    ObtenerServicios,
    ObtenerServicioId,
}