const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const app = new Koa();

const productRoutes = require("./routes/productRoutes");

app.use(bodyParser());
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
