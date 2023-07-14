const pool = require("../bd/conexion.js");
const format = require("pg-format");

const getJoyas = async ({ limits = 4, page = 1, order_by = "id_asc" }) => {
  const [campo, direccion] = order_by.split("_");
  const offset = limits * (page - 1);
  const joyas = await pool.query(
    format(
      "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    )
  );
  return joyas.rows;
};

const getHATEOAS = (joyas) => {
  const results = joyas.map((joya) => ({
    id: joya.id,
    nombre: joya.nombre,
    categoria: joya.categoria,
    metal: joya.metal,
    precio: joya.precio,
    stock: joya.stock,
    url: `/joyas/joya/${joya.id}`,
  }));

  const totalJoyas = 12;
  const totalJoyasXPage = results.length;
  const paginacion = `${page} de ${Math.ceil(totalJoyas / totalJoyasXPage)}`;

  const HATEOAS = {
    totalJoyas,
    totalJoyasXPage,
    page,
    paginacion,
    results,
  };

  return HATEOAS;
};

const getJoya = async (id) => {
  const { rows } = await pool.query("SELECT * FROM inventario WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

const joyasXfiltro = async (querystring) => {
  let filtros = [];
  let values = [];

  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };

  const { categoria, price_max, price_min, stock_max, stock_min, nombre } =
    querystring;

  if (categoria) agregarFiltro("categoria", "ilike", `%${categoria}%`);
  if (price_max) agregarFiltro("precio", "<=", price_max);
  if (price_min) agregarFiltro("precio", ">=", price_min);
  if (stock_max) agregarFiltro("stock", "<=", stock_max);
  if (stock_min) agregarFiltro("stock", ">=", stock_min);
  if (nombre) agregarFiltro("nombre", "ilike", `%${nombre}%`);

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    consulta += " WHERE " + filtros.join(" AND ");
  }
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
};

module.exports = {
  getJoyas,
  getHATEOAS,
  getJoya,
  joyasXfiltro,
};
