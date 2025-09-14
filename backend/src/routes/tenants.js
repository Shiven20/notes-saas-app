import express from "express";
import Tenant from "../models/Tenant.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Upgrade tenant to Pro
router.post("/:slug/upgrade", authMiddleware, adminOnly, async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.params.slug });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  tenant.plan = "pro";
  await tenant.save();

  res.json({ message: "Tenant upgraded to Pro", tenant });
});

export default router;
