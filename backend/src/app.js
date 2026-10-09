const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = new Koa();
app.use(errorHandler);
app.use(bodyParser());
app.use(cors());
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

module.exports = app;
