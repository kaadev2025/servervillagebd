require("dotenv").config();
const express = require("express");
const cors = require("cors");

const clientesRoutes = require("../src/routes/clientes.routes");
const ventasRoutes = require("../src/routes/ventas.routes");
const auth = require("../src/middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de autenticación para todas las rutas
app.use(auth);

app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);

module.exports = app;
