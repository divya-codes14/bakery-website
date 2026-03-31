const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ================= CREATE ORDER =================
router.post("/create", async (req, res) => {
  try {
    const { name, address, phone, userEmail, items, total } = req.body;

    if (!userEmail || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📦 Order received:", userEmail, total);

    const order = new Order({
      name,
      address,
      phone,
      userEmail,
      items,
      total,
      status: "Pending"
    });

    await order.save();

    res.json({ message: "Order placed successfully", order });

  } catch (err) {
    console.log("🔥 REAL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= GET ALL ORDERS =================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ================= UPDATE =================
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ message: "Status updated", order: updated });
  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ================= DELETE =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;