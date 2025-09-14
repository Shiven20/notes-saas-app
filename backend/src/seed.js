import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Tenant from "./models/Tenant.js";
import User from "./models/User.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Tenant.deleteMany();
  await User.deleteMany();

  const acme = await Tenant.create({ name: "Acme", slug: "acme" });
  const globex = await Tenant.create({ name: "Globex", slug: "globex" });

  const password = await bcrypt.hash("password", 10);

  await User.create([
    { email: "admin@acme.test", password, role: "admin", tenant: acme._id },
    { email: "user@acme.test", password, role: "member", tenant: acme._id },
    { email: "admin@globex.test", password, role: "admin", tenant: globex._id },
    { email: "user@globex.test", password, role: "member", tenant: globex._id }
  ]);

  console.log("Seed complete");
  process.exit();
}

seed();
    