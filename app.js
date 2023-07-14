const express = require('express');
const app = express();
const router = express.Router();
const { getJoyas, getHATEOAS, getJoya, joyasXfiltro } = require('./consultas/consultas.js');
const consulta = require('./middleware/middleware.js');
const PORT = process.env.PORT || 3000;


app.get('/', consulta, (req, res) => {
  res.send('Server OK');
})

app.get("/joyas", consulta, async (req, res) => {
  const consultas = req.query;
  page = +req.query.page || 1;
  const products = await getJoyas(consultas);
  const HATEOAS = getHATEOAS(products, page);
  res.json(HATEOAS);
  
});

app.get("/joyas/joya/:id", consulta, async (req, res) => {
  const id = req.params.id;
  const product = await getJoya(id);
  res.json(product);
  
});

app.get("/joyas/filtros", consulta, async (req, res) => {
  const consultas = req.query;
  const products = await joyasXfiltro(consultas);
  res.json(products);
  
});

app.listen(PORT, () => {
  console.log( `listening on port	${PORT}` );
});