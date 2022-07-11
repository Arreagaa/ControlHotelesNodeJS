const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Reservacion = require('../models/reservacion.model');
const Usuario = require('../models/usuario.model');
const Room = require('../models/room.model');
const Registro = require('../models/registro.model');
const Hotel = require('../models/hotel.model');

function agregarReservacion(req, res) {
    var parametros = req.body;
    var reservacionModel = new Reservacion();
    var registroModel = new Registro();
    var idRoom = req.params.idRoom;
    //if(req.user.rol == 'ROL_ADMINISTRADOR') return res.status(500).send({message:'sin permisos admin'});
    //if(req.user.rol == 'ROL_HOTEL') return res.status(500).send({message:'sin permisos hotel'});

    if (parametros.idHotel && parametros.fechaInicio ){
        Room.findOne({_id:idRoom}, (err, result)=>{
            if (err || result === null) return res.status(500).send({message: "habitacion inexistente"})
            reservacionModel.idHotel = parametros.idHotel;
            reservacionModel.idRoom = idRoom;
            reservacionModel.idUsuario = req.user.sub;
            reservacionModel.fechaInicio = parametros.fechaInicio;
            reservacionModel.totalNoches = parametros.totalNoches;
            reservacionModel.save((err, reservacionGuardada) =>{
                if(err) return res.status(500).send({message: "error en la peticion"});
                if(!reservacionGuardada) return res.status(404).send({message: "no se guardo la reservacion"});
                Room.findByIdAndUpdate({_id: idRoom},{ disponibilidad: false},{new:true}, (err, roomGuardado)=>{
                    if(err) return res.status(500).send({message: "error en la peticion"});
                    if(!roomGuardado) return res.status(404).send({message: "no se guardo la habitacion editada"});

                    Room.findOne({_id:idRoom}, (err, roomEncontrado)=>{
                        registroModel.idUsuario = req.user.sub;
                        registroModel.nombreCompra = roomEncontrado.nombreRoom;
                        registroModel.cantidad = reservacionGuardada.totalNoches;
                        registroModel.precio = roomEncontrado.precio*reservacionGuardada.totalNoches;
                        registroModel.save((err, registroGuardado)=>{
                            if(err) return res.status(500).send({message: "error en la peticion"});
                            if(!registroGuardado) return res.status(404).send({message: "no se guardo el registro"});

                            return res.status(200).send({reservacion: reservacionGuardada})
                        })
                    })


                })

            })

        })
    }else {
        return res.status(500).send({message: "campos vacios"})
    }
}

function ObtenerReservaciones (req, res) {

    Reservacion.find((err, reservacionesObtenidas) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ reservaciones: reservacionesObtenidas })
    })
}

function ObtenerReservacionId(req, res){
    var idReservacion = req.params.idReservacion

    Reservacion.findById(idReservacion,(err,reservacionObtenida)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!reservacionObtenida) return res.status(404).send( { mensaje: 'Error al obtener el hotel' });

        return res.status(200).send({ reservaciones: reservacionObtenida });
    })
}

function obtenerReservacionesHotel(req, res) {
    var idHotel = req.params.idHotel;

    /*Hotel.find({ _id: idHotel, idUsuario: req.user.rol }, (err, hotelesEncontrados) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (!hotelesEncontrados) return res.status(404).send({ message: 'No trabaja en el Hotel'});

        Reservacion.find({ idHotel: idHotel }, (err, reservacionesEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });
            if (!reservacionesEncontradas) return res.status(404).send({ message: 'No cuenta con reservaciones' });
            return res.status(200).send({ reservaciones: reservacionesEncontradas });
        });
    });*/

    Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
        if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
        if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

        Reservacion.find({ idHotel: usuarioEncontrado.idHotel }, (err, reservacionesEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });
            if (!reservacionesEncontradas) return res.status(404).send({ message: 'No cuenta con reservaciones' });
            return res.status(200).send({ reservaciones: reservacionesEncontradas });
        });
    })
}

module.exports = {
    agregarReservacion,
    ObtenerReservaciones,
    ObtenerReservacionId,
    obtenerReservacionesHotel
}