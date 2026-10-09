const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const app = new Koa();
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");

const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const host = process.env.MONGODB_HOST;
const database = process.env.MONGODB_DATABASE;

const MONGODB_URI =
  `mongodb+srv://${username}:${password}@${host}/${database}`;
  
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

app.use(bodyParser());
app.use(cors());
app.use(productRoutes.routes());
app.use(productRoutes.allowedMethods());

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
