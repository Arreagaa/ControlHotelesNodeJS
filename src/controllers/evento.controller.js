const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Eventos = require('../models/evento.model');
const Usuario = require('../models/usuario.model');
const Registro = require('../models/registro.model');


function ObtenerEventos (req, res) {

    /*Eventos.find((err, eventosObtenidos) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ eventos: eventosObtenidos })
    })*/

    var idHotel = req.params.idHotel;

    if(req.user.rol == 'ROL_CLIENTE'){
        
        Eventos.find({idHotel: idHotel}, (err, eventosObtenidos)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!eventosObtenidos) return res.status(404).send({mensaje : "Error, no se encuentran habitaciones en dicho Hotel."});

            return res.status(200).send({eventos: eventosObtenidos});
        }).populate('idHotel')

    }else if(req.user.rol == 'ROL_HOTEL'){
        Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
            if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
            if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

            Eventos.find({idHotel: usuarioEncontrado.idHotel}, (err, eventosObtenidos)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion el id"});
                if(!eventosObtenidos) return res.status(404).send({mensaje : "Error, no se encuentran habitaciones en dicho Hotel."});
        
                return res.status(200).send({eventos: eventosObtenidos});
            })
        })
    }
}

function ObtenerEventolId(req, res){
    var idEvento = req.params.idEvento

    Eventos.findById(idEvento,(err, eventoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener el Evento' });

        return res.status(200).send({ eventos: eventoEncontrado });
    })
}

function agregarEvento(req, res){
    var parametros = req.body;
    var eventoModel = new Eventos();

    Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
        if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
        if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })
  
  
    if(parametros.evento, parametros.descripcion){
        eventoModel.evento = parametros.evento;
        eventoModel.descripcion = parametros.descripcion;
        eventoModel.precio = parametros.precio;
        eventoModel.disponibilidad = true;
        eventoModel.idHotel = usuarioEncontrado.idHotel;
            Eventos.find({evento: parametros.evento}
                ,(err, eventoGuardado)=>{
                if(eventoGuardado.length == 0){
                    eventoModel.save((err, eventosGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!eventosGuardado) return res.status(404).send({mensaje: 'No se agrego el evento'});
  
                            return res.status(201).send({eventos: eventosGuardado});
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

function editarEvento(req, res){
    var idEvento = req.params.idEvento;
    var paramentros = req.body;

    Eventos.findByIdAndUpdate({_id: idEvento, evento: paramentros.evento}, paramentros,{new:true},
        (err, eventoEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!eventoEditado) return res.status(400).send({mensaje: 'No se puede editar el evento'});
                
            return res.status(200).send({eventos: eventoEditado});
    })
}

function eliminarEvento(req, res){
    var idEvento = req.params.idEvento;

    Eventos.findByIdAndDelete({_id: idEvento},(err, eventoEliminado)=>{
                
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!eventoEliminado) return res.status(400).send({mensaje: 'No es puede eliminar el evento'});
                
            return res.status(200).send({eventos: eventoEliminado});
        })
}

function comprarEvento (req, res) {
    var idEvento = req.params.idEvento;
    var registroModel = new Registro();

    Eventos.findOne({_id: idEvento}, (err, eventoExistente)=>{
        if (err || eventoExistente === null) return res.status(500).send({message: "Servicio inexistente"});
        Registro.findOne({nombreCompra: eventoExistente.evento}, (err, eventoEncontrado)=>{
            if (err) return res.status(500).send({message: "error en la peticion"});
            if (eventoEncontrado){
                Registro.findOneAndUpdate({ nombreCompra: eventoExistente.evento, idUsuario: req.user.sub}, {
                    $inc: {cantidad: 1}
                },
                    { new: true}, (err, registroModificado)=>{
                        if (err) return res.status(500).send({message: "error en la peticion"});
                        if (!registroModificado) return res.status(404).send({message: "No se encontro nada para modificar"})
                    })
            }else{
                Eventos.findOneAndUpdate({_id: idEvento}, {disponibilidad: false}, {new:true}, (err, eventoEncontrado)=>{
                    if (err) return res.status(500).send({message: "error en la peticion"});
                    if (!eventoEncontrado) return res.status(404).send({message: "No se guardaron los datos"});

                    registroModel.nombreCompra = eventoExistente.evento;
                    registroModel.precio = eventoExistente.precio;
                    registroModel.cantidad = 1;
                    registroModel.idUsuario = req.user.sub;
                    registroModel.save((err, eventoRegistrado)=>{
                        if (err) return res.status(500).send({message: "error en la peticion"});
                        if (!eventoRegistrado) return res.status(404).send({message: "No se guardaron los datos"});
                        return res.status(200).send({eventos: eventoRegistrado});

                    })
                })
            }
        })
    })
}


module.exports = {
    agregarEvento,
    editarEvento,
    eliminarEvento,
    ObtenerEventos,
    ObtenerEventolId,
    comprarEvento
}