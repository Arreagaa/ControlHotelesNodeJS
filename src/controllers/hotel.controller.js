const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Hoteles = require('../models/hotel.model');


function ObtenerHoteles (req, res) {

    Hoteles.find((err, hotelesObtenidos) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ hoteles: hotelesObtenidos })
    })
}

function ObtenerHotelId(req, res){
    var idHotel = req.params.idHotel

    Hoteles.findById(idHotel,(err,hotelEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!hotelEncontrado) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ hoteles: hotelEncontrado });
    })
}

function agregarHotel(req, res){
    var parametros = req.body;
    var hotelModel = new Hoteles();
  
    if(parametros.nombreHotel, parametros.email, parametros.direccion, parametros.telefono, parametros.pais, parametros.precioHabitacion){
        hotelModel.nombreHotel = parametros.nombreHotel;
        hotelModel.email = parametros.email;
        hotelModel.direccion = parametros.direccion;
        hotelModel.telefono = parametros.telefono;
        hotelModel.pais = parametros.pais;
        hotelModel.precioHabitacion = parametros.precioHabitacion;
        hotelModel.idAdmin = req.user.sub;
            Hoteles.find({nombreHotel: parametros.nombreHotel}
                ,(err, empresaGuardada)=>{
                if(empresaGuardada.length == 0){
                        hotelModel.save((err, hotelGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!hotelGuardado) return res.status(404).send({mensaje: 'No se agrego el hotel'});
  
                            return res.status(201).send({hoteles: hotelGuardado});
                         })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Error en la peticion agregar' });
        }
}

function editarHotel(req, res){
    var idHotel = req.params.idHotel;
    var paramentros = req.body;

    Hoteles.findByIdAndUpdate({_id: idHotel, nombre: paramentros.nombre}, paramentros,{new:true},
        (err, hotelEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!hotelEditado) return res.status(400).send({mensaje: 'No se puede editar el hotel'});
                
            return res.status(200).send({hoteles: hotelEditado});
    })
}


function eliminarHotel(req, res){
    var idHotel = req.params.idHotel;

    Hoteles.findByIdAndDelete({_id: idHotel},(err, hotelEliminado)=>{
                
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!hotelEliminado) return res.status(400).send({mensaje: 'No es puede eliminar el hotel'});
                
            return res.status(200).send({hoteles: hotelEliminado});
        })
}


module.exports = {
    agregarHotel,
    editarHotel,
    eliminarHotel,
    ObtenerHoteles,
    ObtenerHotelId,
}