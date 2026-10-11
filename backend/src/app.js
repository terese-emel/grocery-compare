const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const productRoutes = require("./routes/productRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = new Koa();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(errorHandler);
app.use(bodyParser());
app.use(cors({ origin: frontendUrl }));
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());
app.use(healthRoutes.routes());
app.use(healthRoutes.allowedMethods());

module.exports = app;
