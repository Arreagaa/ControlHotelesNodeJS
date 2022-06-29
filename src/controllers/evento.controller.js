const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Eventos = require('../models/evento.model');


function ObtenerEventos (req, res) {

    Eventos.find((err, eventosObtenidos) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ eventos: eventosObtenidos })
    })
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
  
    if(parametros.evento, parametros.descripcion){
        eventoModel.evento = parametros.evento;
        eventoModel.descripcion = parametros.descripcion;
        eventoModel.precio = parametros.precio;
        eventoModel.idHotel = parametros.idHotel;
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


module.exports = {
    agregarEvento,
    editarEvento,
    eliminarEvento,
    ObtenerEventos,
    ObtenerEventolId,
}