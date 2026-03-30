require("dotenv").config();
console.log("THIS SERVER FILE RUNNING");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");

const app = express();   // ✅ MUST COME BEFORE app.use

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes); // ✅ NOW CORRECT

mongoose.connect("mongodb://127.0.0.1:27017/bakeryDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
