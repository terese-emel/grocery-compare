const Router = require("@koa/router");

const requireAuth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  cheapestQuerySchema,
  priceSchema,
  productQuerySchema,
  productSchema,
} = require("../validation/schemas");

const router = new Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProductPrice,
  cheapestProduct,
} = require("../controllers/productController");

router.use(requireAuth);

router.get("/products", validate(productQuerySchema, "query"), getProducts);
router.get(
  "/products/cheapest",
  validate(cheapestQuerySchema, "query"),
  cheapestProduct,
);
router.get("/products/:id", getProductById);
router.post(
  "/products",
  validate(productSchema, "body", "Invalid product data"),
  createProduct,
);
router.put(
  "/products/:id",
  validate(productSchema, "body", "Invalid product data"),
  updateProduct,
);
router.delete("/products/:id", deleteProduct);
router.patch(
  "/products/:id",
  validate(priceSchema, "body", "Valid price is required"),
  patchProductPrice,
);

module.exports = router;
