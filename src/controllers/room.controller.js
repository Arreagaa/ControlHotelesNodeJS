const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Room = require('../models/room.model');
const Usuario = require('../models/usuario.model')


function ObtenerRooms (req, res) {
    var idHotel = req.params.idHotel;

    if(req.user.rol == 'ROL_CLIENTE'){
        
        Room.find({idHotel: idHotel}, (err, roomsObtenidos)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!roomsObtenidos) return res.status(404).send({mensaje : "Error, no se encuentran habitaciones en dicho Hotel."});

            return res.status(200).send({rooms: roomsObtenidos});
        }).populate('idHotel')

    }else if(req.user.rol == 'ROL_HOTEL'){
        Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
            if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
            if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

            Room.find({idHotel: usuarioEncontrado.idHotel}, (err, roomsObtenidos)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion el id"});
                if(!roomsObtenidos) return res.status(404).send({mensaje : "Error, no se encuentran habitaciones en dicho Hotel."});
        
                return res.status(200).send({rooms: roomsObtenidos});
            })
        })
    }
}

function ObtenerRoomId(req, res){
    var idRoom = req.params.idRoom

    Room.findById(idRoom,(err,roomEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!roomEncontrado) return res.status(404).send( { mensaje: 'Error al obtener la habitacion' });

        return res.status(200).send({ rooms: roomEncontrado });
    })
}

function agregarRoom(req, res){
    var parametros = req.body;
    var roomModel = new Room();
  
    Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
        if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
        if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

    if(parametros.nombreRoom, parametros.tipo, parametros.precio){
        roomModel.nombreRoom = parametros.nombreRoom;
        roomModel.tipo = parametros.tipo;
        roomModel.precio = parametros.precio;
        roomModel.disponibilidad = true;
        roomModel.idHotel = usuarioEncontrado.idHotel;
            Room.find({nombreRoom: parametros.nombreRoom}
                ,(err, roomGuardado)=>{
                if(roomGuardado.length == 0){
                    roomModel.save((err, roomSave) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!roomSave) return res.status(404).send({mensaje: 'No se agrego la habitacion'});
  
                            return res.status(201).send({rooms: roomSave});
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

function editarRoom(req, res){
    var idRoom = req.params.idRoom;
    var paramentros = req.body;

    Room.findByIdAndUpdate({_id: idRoom, nombreRoom: paramentros.nombreRoom}, paramentros,{new:true},
        (err, roomEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!roomEditado) return res.status(400).send({mensaje: 'No se puede editar la habitacion'});
                
            return res.status(200).send({rooms: roomEditado});
    })
}

function eliminarRoom(req, res){
    var idRoom = req.params.idRoom;

    Room.findByIdAndDelete({_id: idRoom},(err, roomEliminado)=>{
                
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!roomEliminado) return res.status(400).send({mensaje: 'No es puede eliminar la habitacion'});
                
            return res.status(200).send({rooms: roomEliminado});
        })
}


module.exports = {
    agregarRoom,
    editarRoom,
    eliminarRoom,
    ObtenerRooms,
    ObtenerRoomId,
}