const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

connection();

//Crear servidor node
const app = express();
const port = 3901;

//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Recibir datos por form-urlencoded

//Crear servidor y escuchar peticiones http
app.listen(port, () => {
  console.log("Server working at port " + port);
});

//Rutas
const stocksRoutes = require("./routes/stocks");
const userRoutes = require("./routes/user");

app.use("/api", stocksRoutes);
app.use("/api", userRoutes);
