// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const clientesRoutes = require("./routes/clientes.routes");
// const ventasRoutes = require("./routes/ventas.routes");
// const auth = require("./middleware/auth");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Autenticación simple: requiere `API_KEY` en el .env y el header `x-api-key` o `Authorization: Bearer <KEY>`
// app.use(auth);

// app.use("/api/clientes", clientesRoutes);
// app.use("/api/ventas", ventasRoutes);

// app.listen(process.env.PORT, () => {
//   console.log(`API corriendo en puerto ${process.env.PORT}`);
// });


const express = require("express");
const cors = require("cors");
const clientesRoutes = require("./routes/clientes.routes");
const ventasRoutes = require("./routes/ventas.routes");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(auth);

app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);

// **IMPORTANTE:** no usar app.listen
// Vercel usará el export como handler
module.exports = app;
