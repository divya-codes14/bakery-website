


const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");



const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"yourgmail@gmail.com",
    pass:"your_app_password"
  }
});

router.post("/create", async (req, res) => {
  try {
    const { userEmail, items, total } = req.body;

    console.log("Order API hit:", userEmail, total);

    const order = new Order({ userEmail, items, total });
    await order.save();
    console.log("📧 Sending email...");
    console.log("✅ Email sent");
    const mailOptions = {
  from: "yourgmail@gmail.com",
  to: req.body.email,
  subject: "Order Confirmation 🧁",
  html: `
    <h2>🎉 Order Confirmed!</h2>
    <p><b>Name:</b> ${req.body.name}</p>
    <p><b>Address:</b> ${req.body.address}</p>
    <p><b>Phone:</b> ${req.body.phone}</p>
    <p><b>Status:</b> Pending</p>
  `
};

await transporter.sendMail(mailOptions);

    // TEMP: skip email
    console.log("Email skipped");

    res.json({ message: "Order placed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order failed" });
  }
});
module.exports = router;
// GET ALL ORDERS
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ _id: -1 });
  res.json(orders);
});

// UPDATE STATUS
router.put("/update/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });

  res.json({ message: "Status updated" });
});