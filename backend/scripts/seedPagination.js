const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { getConfig } = require("../src/config");
const User = require("../src/models/User");
const Product = require("../src/models/Product");

const demoEmail = "pagination-demo@example.com";
const demoPassword = "password123";
const shops = ["ICA", "Coop", "Hemköp", "Willys", "Lidl"];

async function seedPaginationData() {
  const isProduction = process.env.NODE_ENV === "production";
  const productionConfirmed = process.argv.includes("--production");

  if (isProduction && !productionConfirmed) {
    throw new Error(
      "Production seeding is disabled. Add --production only after verifying the database target.",
    );
  }

  const { mongoUri } = getConfig();
  await mongoose.connect(mongoUri);

  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    user = await User.create({
      email: demoEmail,
      passwordHash: await bcrypt.hash(demoPassword, 10),
    });
  }

  await Product.deleteMany({ owner: user._id });

  const products = Array.from({ length: 25 }, (_, index) => ({
    name: "Pagination Milk",
    shop: shops[index % shops.length],
    price: Number((10 + index * 0.35).toFixed(2)),
    unit: "1L",
    owner: user._id,
  }));

  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products for ${demoEmail}.`);
  console.log(`Login with email: ${demoEmail}`);
  console.log(`Login with password: ${demoPassword}`);
  console.log("Search for: Pagination Milk");
}

seedPaginationData()
  .catch((error) => {
    console.error("Could not seed pagination data:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
