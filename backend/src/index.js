const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.use(bodyParser());
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
