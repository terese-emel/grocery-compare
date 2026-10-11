const Router = require("@koa/router");
const authController = require("../controllers/authController");

const router = new Router({
  prefix: "/auth",
});

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
