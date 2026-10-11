const Router = require("@koa/router");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

const router = new Router({
  prefix: "/auth",
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;
