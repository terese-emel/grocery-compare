const Router = require("@koa/router");

const requireAuth = require("../middleware/authMiddleware");

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

router.get("/products", getProducts);
router.get("/products/cheapest", cheapestProduct);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id", patchProductPrice);

module.exports = router;
