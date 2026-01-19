const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const { cli_codigo, cli_nombre } = req.query;

  let sql = `
    SELECT c.cli_codigo, c.cli_nombre, c.cli_ruc, c.cli_zona, c.cli_codvdd, c.CLI_UPDATE, v.ultima_fecha_pago
    FROM cliente c
    LEFT JOIN (
      SELECT ven_codcli, DATE_FORMAT(MAX(ven_fecha), '%d-%m-%Y') AS ultima_fecha_pago
      FROM venta
      GROUP BY ven_codcli
    ) v ON v.ven_codcli = c.cli_codigo
    WHERE 1 = 1
  `;

  const params = [];

  if (cli_codigo) {
    sql += " AND (c.cli_codigo = ? OR CAST(c.cli_codigo AS UNSIGNED) = ?)";
    params.push(cli_codigo, cli_codigo);
  }

  if (cli_nombre) {
    sql += " AND c.cli_nombre LIKE ?";
    params.push(`%${cli_nombre}%`);
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT c.cli_codigo, c.cli_nombre, c.cli_ruc, c.cli_zona, c.cli_codvdd, c.CLI_UPDATE, v.ultima_fecha_pago
    FROM cliente c
    LEFT JOIN (
      SELECT ven_codcli, DATE_FORMAT(MAX(ven_fecha), '%d-%m-%Y') AS ultima_fecha_pago
      FROM venta
      GROUP BY ven_codcli
    ) v ON v.ven_codcli = c.cli_codigo
    WHERE c.cli_codigo = ? OR CAST(c.cli_codigo AS UNSIGNED) = ?
  `;

  try {
    const [rows] = await db.query(sql, [id, id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
