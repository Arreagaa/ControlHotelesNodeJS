exports.verAdmin = function (req, res, next) {
    if (req.user.rol !== "ROL_ADMINISTRADOR")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
};
  
exports.verHotel = function (req, res, next) {
    if (req.user.rol !== "ROL_HOTEL")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
};
  
exports.verCliente = function (req, res, next) {
    if (req.user.rol !== "ROL_CLIENTE")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
};