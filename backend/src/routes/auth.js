import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
       
    // Check if user exists
    const user = await User.findOne({ email }).populate("tenant");
    
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
     
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT with tenant info
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant._id,
        tenantSlug: user.tenant.slug,
        tenantPlan: user.tenant.plan
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      tenant: {
        id: user.tenant._id,
        slug: user.tenant.slug,
        plan: user.tenant.plan,
        company: user.tenant.name, 
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
