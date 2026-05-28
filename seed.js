// require("dotenv").config();
// const mongoose = require("mongoose");
// const Sale = require("./models/Sale");

// const TOTAL_RECORDS = 500000;
// const BATCH_SIZE = 10000; // Insert 10k at a time to prevent memory crashes

// // Helper arrays for randomized realistic data
// const categories = {
//   Hardware: ["Laptops", "Desktops", "Servers", "Monitors"],
//   Software: ["OS Licenses", "Antivirus", "Cloud Subscriptions", "Design Tools"],
//   Accessories: ["Keyboards", "Mice", "Cables", "Docking Stations"],
//   Services: ["Consulting", "Installation", "Extended Warranty"],
// };
// const regions = {
//   "North America": ["USA", "Canada", "Mexico"],
//   Europe: ["UK", "Germany", "France", "Spain"],
//   Asia: ["Japan", "India", "China", "South Korea"],
//   "South America": ["Brazil", "Argentina", "Chile"],
//   Oceania: ["Australia", "New Zealand"],
// };
// const customerTypes = ["New", "Returning", "Enterprise"];
// const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Crypto"];
// const statuses = [
//   "Completed",
//   "Completed",
//   "Completed",
//   "Completed",
//   "Pending",
//   "Refunded",
// ]; // Weighted heavily toward Completed

// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB.");

//     console.log("🗑️  Clearing existing data (this might take a moment)...");
//     await Sale.deleteMany();
//     console.log("✅ Database cleared.");

//     console.log(
//       `🚀 Starting generation of ${TOTAL_RECORDS} records in batches of ${BATCH_SIZE}...`,
//     );

//     let totalInserted = 0;

//     // Outer loop runs 50 times (50 * 10,000 = 500,000)
//     for (let i = 0; i < TOTAL_RECORDS / BATCH_SIZE; i++) {
//       const batch = [];

//       // Inner loop builds a single batch of 10,000
//       for (let j = 0; j < BATCH_SIZE; j++) {
//         // Pick random category & sub-category
//         const categoryKeys = Object.keys(categories);
//         const selectedCategory =
//           categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
//         const subCategories = categories[selectedCategory];
//         const selectedSubCategory =
//           subCategories[Math.floor(Math.random() * subCategories.length)];

//         // Pick random region & country
//         const regionKeys = Object.keys(regions);
//         const selectedRegion =
//           regionKeys[Math.floor(Math.random() * regionKeys.length)];
//         const countries = regions[selectedRegion];
//         const selectedCountry =
//           countries[Math.floor(Math.random() * countries.length)];

//         // Calculate realistic financials
//         const unitPrice = Math.floor(Math.random() * 2000) + 15; // $15 to $2015
//         const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
//         const discount = Math.random() > 0.8 ? Math.floor(unitPrice * 0.1) : 0; // 20% chance of a 10% discount
//         const totalAmount = unitPrice * quantity - discount;
//         const profitMargin = parseFloat((Math.random() * 0.4 + 0.1).toFixed(2)); // Margin between 10% and 50%

//         // Random date within the last 2 years
//         const twoYearsAgo = new Date();
//         twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
//         const randomDate = new Date(
//           twoYearsAgo.getTime() +
//             Math.random() * (Date.now() - twoYearsAgo.getTime()),
//         );

//         batch.push({
//           transactionId: `TXN-${Date.now()}-${i}-${j}-${Math.floor(Math.random() * 1000)}`,
//           productCategory: selectedCategory,
//           subCategory: selectedSubCategory,
//           unitPrice,
//           quantity,
//           discountApplied: discount,
//           totalAmount,
//           profitMargin,
//           customerType:
//             customerTypes[Math.floor(Math.random() * customerTypes.length)],
//           paymentMethod:
//             paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
//           orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
//           region: selectedRegion,
//           country: selectedCountry,
//           date: randomDate,
//         });
//       }

//       // Insert the batch into MongoDB
//       await Sale.insertMany(batch);
//       totalInserted += BATCH_SIZE;

//       // Log progress so you know it hasn't frozen
//       console.log(
//         `⏳ Progress: ${totalInserted.toLocaleString()} / ${TOTAL_RECORDS.toLocaleString()} records inserted...`,
//       );
//     }

//     console.log("🎉 SUCCESS! Seeded half a million records flawlessly.");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error seeding database:", error);
//     process.exit(1);
//   }
// };

// seedDatabase();
require("dotenv").config();
const mongoose = require("mongoose");
const Sale = require("./models/Sale");

const TOTAL_RECORDS = 500000;
const BATCH_SIZE = 10000;

const categories = {
  Hardware: ["Laptops", "Desktops", "Servers", "Monitors"],
  Software: ["OS Licenses", "Antivirus", "Cloud Subscriptions", "Design Tools"],
  Accessories: ["Keyboards", "Mice", "Cables", "Docking Stations"],
  Services: ["Consulting", "Installation", "Extended Warranty"],
};

const regions = {
  "North America": ["USA", "Canada", "Mexico"],
  Europe: ["UK", "Germany", "France", "Spain"],
  Asia: ["Japan", "India", "China", "South Korea"],
  "South America": ["Brazil", "Argentina", "Chile"],
  Oceania: ["Australia", "New Zealand"],
};

const customerTypes = ["New", "Returning", "Enterprise"];
const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Crypto"];
const statuses = [
  "Completed",
  "Completed",
  "Completed",
  "Completed",
  "Pending",
  "Refunded",
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB.");

    console.log("🗑️ Clearing existing data...");
    await Sale.deleteMany();
    console.log("✅ Database cleared.");

    // ====================================================================
    // DYNAMIC MARKET TREND GENERATOR (The Fix)
    // Every time you run this script, these multipliers change completely!
    // ====================================================================
    console.log("📊 Rolling random market conditions for this run...");

    const regionalVolumeMultiplier = {
      "North America": Math.random() * 1.5 + 0.5, // Wildly shifts order volume
      Europe: Math.random() * 1.5 + 0.5,
      Asia: Math.random() * 1.5 + 0.5,
      "South America": Math.random() * 0.8 + 0.2,
      Oceania: Math.random() * 0.8 + 0.2,
    };

    const categoryPriceMultiplier = {
      Hardware: Math.random() * 0.5 + 0.8, // Shifts pricing power per sector
      Software: Math.random() * 0.5 + 0.8,
      Accessories: Math.random() * 0.3 + 0.8,
      Services: Math.random() * 0.7 + 0.8,
    };

    console.log(`🚀 Seeding ${TOTAL_RECORDS} heavily biased records...`);
    let totalInserted = 0;

    for (let i = 0; i < TOTAL_RECORDS / BATCH_SIZE; i++) {
      const batch = [];

      for (let j = 0; j < BATCH_SIZE; j++) {
        // 1. Pick Category & Sub-Category
        const categoryKeys = Object.keys(categories);
        const selectedCategory =
          categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const subCategories = categories[selectedCategory];
        const selectedSubCategory =
          subCategories[Math.floor(Math.random() * subCategories.length)];

        // 2. Pick Region & Country (Using volume weights so regions are NOT equal)
        let selectedRegion = "North America";
        const regionKeys = Object.keys(regions);

        // Loop until a region wins a probability check based on its random run weight
        while (true) {
          const potentialRegion =
            regionKeys[Math.floor(Math.random() * regionKeys.length)];
          if (Math.random() < regionalVolumeMultiplier[potentialRegion] / 2) {
            selectedRegion = potentialRegion;
            break;
          }
        }
        const countries = regions[selectedRegion];
        const selectedCountry =
          countries[Math.floor(Math.random() * countries.length)];

        // 3. Realistic Base Pricing Tiers per Category
        let basePrice = 50;
        if (selectedCategory === "Hardware")
          basePrice = Math.floor(Math.random() * 1200) + 400; // $400 - $1600
        else if (selectedCategory === "Software")
          basePrice = Math.floor(Math.random() * 400) + 60; // $60 - $460
        else if (selectedCategory === "Accessories")
          basePrice = Math.floor(Math.random() * 90) + 15; // $15 - $105
        else if (selectedCategory === "Services")
          basePrice = Math.floor(Math.random() * 1800) + 200; // $200 - $2000

        // Apply the dynamic run modifier to the price
        const unitPrice = Math.floor(
          basePrice * categoryPriceMultiplier[selectedCategory],
        );

        // Quantities change based on customer type (Enterprise buys in bulk!)
        const selectedCustomer =
          customerTypes[Math.floor(Math.random() * customerTypes.length)];
        let quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items default
        if (selectedCustomer === "Enterprise")
          quantity = Math.floor(Math.random() * 15) + 5; // 5-20 items bulk

        // Financial Math
        const discount =
          Math.random() > 0.75 ? Math.floor(unitPrice * 0.15) : 0;
        const totalAmount = unitPrice * quantity - discount;
        const profitMargin = parseFloat(
          (Math.random() * 0.35 + 0.15).toFixed(2),
        ); // 15% to 50%

        // Timestamps over a 2-year timeline
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        const randomDate = new Date(
          twoYearsAgo.getTime() +
            Math.random() * (Date.now() - twoYearsAgo.getTime()),
        );

        batch.push({
          transactionId: `TXN-${Date.now()}-${i}-${j}-${Math.floor(Math.random() * 10000)}`,
          productCategory: selectedCategory,
          subCategory: selectedSubCategory,
          unitPrice,
          quantity,
          discountApplied: discount,
          totalAmount,
          profitMargin,
          customerType: selectedCustomer,
          paymentMethod:
            paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
          region: selectedRegion,
          country: selectedCountry,
          date: randomDate,
        });
      }

      await Sale.insertMany(batch);
      totalInserted += BATCH_SIZE;
      console.log(
        `⏳ Progress: ${totalInserted.toLocaleString()} / ${TOTAL_RECORDS.toLocaleString()} records inserted...`,
      );
    }

    console.log("🎉 SUCCESS! Seeded a highly dynamic ecosystem.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
