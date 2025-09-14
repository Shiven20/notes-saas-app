import express from "express";
import UpgradeRequest from "../models/upgradeRequest.js";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// 1. User requests upgrade
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tenant = await Tenant.findById(user.tenant);

    const existing = await UpgradeRequest.findOne({ user: user._id, status: "pending" });
    if (existing) return res.status(400).json({ message: "Request already pending" });

    const request = new UpgradeRequest({ tenant: tenant._id, user: user._id });
    await request.save();

    res.json({ message: "Upgrade request sent to admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Admin views pending requests
router.get("/pending", authMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (admin.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const requests = await UpgradeRequest.find({ tenant: admin.tenant, status: "pending" })
      .populate("user", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Admin approves request
router.post("/approve/:requestId", authMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (admin.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const request = await UpgradeRequest.findById(req.params.requestId).populate("user");
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "approved";
    await request.save();

    const user = request.user;
    user.plan = "pro";
    await user.save();

    res.json({ message: "User upgraded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 4. Admin rejects request
router.post("/reject/:requestId", authMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (admin.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const request = await UpgradeRequest.findById(req.params.requestId).populate("user");
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 5. User checks their latest request status
// In upgrade.js
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const request = await UpgradeRequest.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!request) return res.json({ status: "none" });
    res.json({ status: request.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
