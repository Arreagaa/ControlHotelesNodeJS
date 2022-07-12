const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Servicios = require('../models/servicio.model');
const Usuario = require('../models/usuario.model');
const Registro = require('../models/registro.model');

function ObtenerServicios (req, res) {

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

    Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
        if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
        if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })
  
    if(parametros.servicio, parametros.precio){
        servicioModel.servicio = parametros.servicio;
        servicioModel.precio = parametros.precio;
        servicioModel.disponibilidad = true;
        servicioModel.idHotel = usuarioEncontrado.idHotel;
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
    })
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

function comprarServicio (req, res) {
    var idServicio = req.params.idServicio;
    var registroModel = new Registro();

    Servicios.findOne({_id: idServicio}, (err, servicioExistente)=>{
        if (err || servicioExistente === null) return res.status(500).send({message: "Servicio inexistente"});
        Registro.findOne({nombreCompra: servicioExistente.servicio}, (err, servicioEncontrado)=>{
            if (err) return res.status(500).send({message: "error en la peticion"});
            if (servicioEncontrado){
                Registro.findOneAndUpdate({ nombreCompra: servicioExistente.servicio, idUsuario: req.user.sub}, {
                    $inc: {cantidad: 1}
                },
                    { new: true}, (err, registroModificado)=>{
                        if (err) return res.status(500).send({message: "error en la peticion"});
                        if (!registroModificado) return res.status(404).send({message: "No se encontro nada para modificar"})
                    })
            }else{
                Servicios.findOneAndUpdate({_id: idServicio}, {disponibilidad: false}, {new:true}, (err, servicioEncontrado)=>{
                    if (err) return res.status(500).send({message: "error en la peticion"});
                    if (!servicioEncontrado) return res.status(404).send({message: "No se guardaron los datos"});

                    registroModel.nombreCompra = servicioExistente.servicio;
                    registroModel.precio = servicioExistente.precio;
                    registroModel.cantidad = 1;
                    registroModel.idUsuario = req.user.sub;
                    registroModel.save((err, servicioRegistrado)=>{
                        if (err) return res.status(500).send({message: "error en la peticion"});
                        if (!servicioRegistrado) return res.status(404).send({message: "No se guardaron los datos"});
                        return res.status(200).send({servicios: servicioRegistrado});

                    })
                })
            }
        })
    })
}


module.exports = {
    agregarServicio,
    editarServicio,
    eliminarServicio,
    ObtenerServicios,
    ObtenerServicioId,
    comprarServicio
}