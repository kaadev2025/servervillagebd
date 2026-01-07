const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const { cli_codigo, cli_nombre } = req.query;

  let sql = `
    SELECT cli_codigo, cli_nombre, cli_ruc, cli_zona, cli_codvdd, CLI_UPDATE
    FROM cliente
    WHERE 1 = 1
  `;

  const params = [];

  if (cli_codigo) {
    sql += " AND (cli_codigo = ? OR CAST(cli_codigo AS UNSIGNED) = ?)";
    params.push(cli_codigo, cli_codigo);
  }

  if (cli_nombre) {
    sql += " AND cli_nombre LIKE ?";
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
    SELECT cli_codigo, cli_nombre, cli_ruc, cli_zona, cli_codvdd, CLI_UPDATE
    FROM cliente
    WHERE cli_codigo = ? OR CAST(cli_codigo AS UNSIGNED) = ?
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
