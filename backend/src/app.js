const Koa = require("koa");
const helmet = require("koa-helmet");
const { RateLimit } = require("koa2-ratelimit");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const productRoutes = require("./routes/productRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = new Koa();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const apiLimiter = RateLimit.middleware({
  interval: { min: 15 },
  max: 100,
  message: "Too many requests. Please try again later.",
});

app.use(errorHandler);
app.use(helmet());
app.use(bodyParser({ jsonLimit: "100kb" }));
app.use(cors({ origin: frontendUrl }));
app.use(apiLimiter);
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());
app.use(healthRoutes.routes());
app.use(healthRoutes.allowedMethods());

module.exports = app;
