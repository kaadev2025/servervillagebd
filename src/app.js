require("dotenv").config();
const express = require("express");
const cors = require("cors");

const clientesRoutes = require("./routes/clientes.routes");
const ventasRoutes = require("./routes/ventas.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API corriendo en puerto ${process.env.PORT}`);
});
