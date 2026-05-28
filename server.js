require("dotenv").config();
const express = require("express");
const ConnectDatabase = require("./models/connecting_dataBase");
const validatingQuery = require("./models/validating_query");
const generateUI = require("./models/generateUI");
const Sale = require("./models/Sale");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// --- SECURITY LAYER ---

// PORT AND DATABASE CONNECTION
PORT = 3000;
ConnectDatabase();

// Allow requests from your React Vite frontend
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Middleware to set security headers
app.use(helmet());

// Limit queries to 10 per minute per IP[cite: 38].
const llmRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // Max 5 requests per minute
  message: {
    error:
      "oops! You've hit the rate limit. Please wait a minute before analyzing more data.",
  },
});

// Sanitize user input before embedding it into the prompt. Strip out special characters or system instructions. [cite: 41]
const sanitizeInput = (input) => {
  if (!input) return "";
  // Removes anything that isn't a letter, number, space, or basic punctuation.
  // Also restricts the length to 200 characters to prevent prompt-stuffing.
  return input.replace(/[^a-zA-Z0-9 ?.,_-]/g, "").substring(0, 200);
};

app.get("/api/health", (req, res) => {
  res.send("Hello world");
});

// 3. Raw Data Explorer Route (with Server-Side Pagination)
app.get("/api/dashboard/sales", async (req, res) => {
  try {
    // Get page and limit from query parameters, default to Page 1, 50 records per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Calculate how many documents to skip
    const skipIndex = (page - 1) * limit;

    // Fetch the specific chunk of data from MongoDB, sorted by newest first
    const salesData = await Sale.find()
      .sort({ date: -1 }) // Newest transactions at the top
      .skip(skipIndex)
      .limit(limit);

    // console.log("sales Data Api hit");

    // Get total count of records in the database (crucial for frontend pagination controls)
    const totalRecords = await Sale.countDocuments();

    // Send back the chunk of data along with meta-information for the frontend UI
    res.status(200).json({
      success: true,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        perPage: limit,
      },
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching raw sales data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// 2. The Core AI Generation Route
app.post("/api/dashboard/query", llmRateLimiter, async (req, res) => {
  try {
    const { query } = req.body;

    // call llm to validate and extract safe variables from the user query
    responseValidation = await validatingQuery(query);

    let groupBy = "$region"; // Default grouping if LLM fails to provide a valid one
    const safeGroupBy = responseValidation.groupBy;
    // console.log("Safe GroupBy Variable:", safeGroupBy);

    if (safeGroupBy === "$productCategory") {
      groupBy = "$productCategory";
      console.log("Grouping by product category based on user query.");
      console.log("----------------------------------------------------------");
    } else if (safeGroupBy === "$region") {
      groupBy = "$region";
      console.log("Grouping by region based on user query.");
      console.log("----------------------------------------------------------");
    } else if (safeGroupBy === "$customerType") {
      groupBy = "$customerType";
      console.log("Grouping by customer type based on user query.");
      console.log("----------------------------------------------------------");
    } else if (safeGroupBy === "$paymentMethod") {
      groupBy = "$paymentMethod";
      console.log("Grouping by payment method based on user query.");
      console.log("----------------------------------------------------------");
    } else if (safeGroupBy === "$country") {
      groupBy = "$country";
      console.log("Grouping by country based on user query.");
      console.log("----------------------------------------------------------");
    } else {
      console.warn(
        "LLM returned an unexpected groupBy value. Defaulting to $region.",
      );
      console.log("----------------------------------------------------------");
    }

    const rawData = await Sale.aggregate([
      { $group: { _id: groupBy, totalSales: { $sum: "$totalAmount" } } },
    ]);

    // call llm to generate the UI JSON based on the validated query and raw data
    const responseGenerateUI = await generateUI(query, rawData);

    res.status(200).json(responseGenerateUI);
  } catch (error) {
    console.error("Dashboard Query Error:", error);
    res.status(500).json({
      error:
        "Failed to generate a valid UI component. Please try another query.",
    });
  }
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});
