require("dotenv").config();
const express = require("express");
const cors = require("cors");

const clientesRoutes = require("../src/routes/clientes.routes");
const ventasRoutes = require("../src/routes/ventas.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);

module.exports = app;
