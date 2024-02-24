const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });

connection();

//Crear servidor node
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Recibir datos por form-urlencoded

//Crear servidor y escuchar peticiones http
app.listen(port, host, () => {
  console.log("Server working at port " + port);
});

//Rutas
const stocksRoutes = require("./routes/stocks");
const userRoutes = require("./routes/user");

app.use("/api", stocksRoutes);
app.use("/api", userRoutes);
