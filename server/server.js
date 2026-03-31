require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");

const app = express();

// ✅ VERY IMPORTANT
mongoose.set("bufferCommands", false);

app.use(cors());
app.use(express.json());

// ✅ CONNECT FIRST
mongoose.connect("mongodb://06divyashree_db_user:divu1407@ac-8mkkkzx-shard-00-00.rn9slj8.mongodb.net:27017,ac-8mkkkzx-shard-00-01.rn9slj8.mongodb.net:27017,ac-8mkkkzx-shard-00-02.rn9slj8.mongodb.net:27017/?ssl=true&replicaSet=atlas-tqi8de-shard-0&authSource=admin&appName=Cluster0")

.then(() => {
  console.log("MongoDB Connected");

  // ✅ THEN routes
  app.use("/api/auth", authRoutes);
  app.use("/api/order", orderRoutes);

  // ✅ THEN server
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
})
.catch(err => console.log(err));

