const Router = require("@koa/router");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { loginSchema, registerSchema } = require("../validation/schemas");

const router = new Router({
  prefix: "/auth",
});

router.post("/register", validate(registerSchema, "body"), authController.register);
router.post("/login", validate(loginSchema, "body"), authController.login);
router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;
