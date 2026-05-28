const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },

  // 1. Granular Product Data
  productCategory: {
    type: String,
    enum: ["Hardware", "Software", "Accessories", "Services"],
    required: true,
  },
  subCategory: { type: String, required: true }, // e.g., "Laptops", "Antivirus", "Cables"

  // 2. Financial Metrics
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  discountApplied: { type: Number, default: 0 }, // Percentage or flat amount
  totalAmount: { type: Number, required: true }, // unitPrice * quantity - discount
  profitMargin: { type: Number, required: true }, // e.g., 0.25 for 25%

  // 3. Customer & Transaction Details
  customerType: {
    type: String,
    enum: ["New", "Returning", "Enterprise"],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer", "Crypto"],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Completed", "Pending", "Refunded", "Cancelled"],
    default: "Completed",
  },

  // 4. Logistics & Time
  region: {
    type: String,
    enum: ["North America", "Europe", "Asia", "South America", "Oceania"],
    required: true,
  },
  country: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// ==========================================
// MONGODB INDEXES (for 500k+ records)
// ==========================================
SaleSchema.index({ date: -1 });
SaleSchema.index({ region: 1, productCategory: 1 });
SaleSchema.index({ customerType: 1 });

module.exports = mongoose.model("Sale", SaleSchema);
