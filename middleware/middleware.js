
const consulta = (req, res, next) => {
  const url = req.url;
  const method = req.method;
  console.log(`Hoy ${new Date()} se ha realizado una consulta en ${url},usando el metodo ${method}`);
  next();
}

module.exports = consulta