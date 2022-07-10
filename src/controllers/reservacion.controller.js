const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Reservacion = require('../models/reservacion.model');
const Usuario = require('../models/usuario.model');
const Room = require('../models/room.model');
const Registro = require('../models/registro.model');

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


module.exports = {
    agregarReservacion
}