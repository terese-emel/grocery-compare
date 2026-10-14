const { z } = require("zod");

const email = z.string().trim().email();
const password = z.string().min(8, "Password must contain at least 8 characters");

const registerSchema = z.object({ email, password });
const loginSchema = z.object({
  email: z.string({ error: "Email and password are required" }).trim().email(),
  password: z
    .string({ error: "Email and password are required" })
    .min(1, "Email and password are required"),
});

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  shop: z.string().trim().min(1).max(200),
  price: z.coerce.number().finite().nonnegative(),
  unit: z.string().trim().min(1).max(50),
});

const priceSchema = z.object({
  price: z.coerce.number().finite().nonnegative(),
});

const productQuerySchema = z.object({
  name: z.string().trim().optional().default(""),
  shop: z.string().trim().optional().default(""),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

const cheapestQuerySchema = z.object({
  name: z.string().trim().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  priceSchema,
  productQuerySchema,
  cheapestQuerySchema,
};
