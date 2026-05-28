// const { z } = require("zod");

// const generateUI = async (query, rawData) => {
//   // 1. Define the Zod Schema to prevent frontend crashes
//   const llmResponseSchema = z.object({
//     _thought: z.string().optional(), // We are adding this for the AI's Chain of Thought
//     componentType: z.enum([
//       "BarChart",
//       "LineChart",
//       "PieChart",
//       "AreaChart",
//       "RadarChart",
//       "SummaryCards",
//     ]),
//     title: z.string(),
//     data: z.array(z.record(z.any())),
//     xAxisKey: z.string().nullable().optional(), // Allows null or missing
//     yAxisKeys: z.array(z.string()).nullable().optional(), // Allows null or missing
//   });

//   // call the LLM to generate the UI JSON based on the validated query and raw data
//   const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "llama3",
//       format: "json", // CRITICAL: Forces strict JSON output

//       prompt: `
//             You are an expert React UI and Data Visualization engineer.
//             Your task is to analyze a user's analytical query and a raw database array, and output a strictly typed JSON object for Recharts.

//             CRITICAL INSTRUCTIONS:
//             1. NEVER output \`null\`. If a key is not required, omit it entirely from the JSON.
//             2. The "componentType" MUST be exactly one of: "BarChart", "LineChart", "PieChart", "AreaChart", "RadarChart", "SummaryCards".
//             3. You must accurately map the exact keys from the Raw Data into the "xAxisKey" and "yAxisKeys".
//             4. You MUST process your logic in the "_thought" key first before generating the rest of the schema.

//             REQUIRED JSON SCHEMA:
//             {
//               "_thought": "Briefly explain which chart is best, and identify the exact X and Y data keys from the raw data.",
//               "componentType": "...",
//               "title": "...",
//               "data": [Array of data always objects],
//               "xAxisKey": "...", // OMIT if not needed.
//               "yAxisKeys": ["..."]
//             }

//             --- EXAMPLES ---

//             Scenario 1: Categorical Comparison
//             User Query: "Show me total sales by region"
//             Raw Data: [{"_id":"North America","totalSales":15000}, {"_id":"Europe","totalSales":9500}]
//             Output:
//             {
//               "_thought": "The user wants to compare categorical data (regions). A BarChart is ideal. The X-axis should be the region name ('_id') and the Y-axis should be the numerical value ('totalSales').",
//               "componentType": "BarChart",
//               "title": "Total Sales by Region",
//               "data": [{"_id":"North America","totalSales":15000}, {"_id":"Europe","totalSales":9500}],
//               "xAxisKey": "_id",
//               "yAxisKeys": ["totalSales"]
//             }

//             Scenario 2: Proportions and Market Share
//             User Query: "What is the revenue breakdown by product category?"
//             Raw Data: [{"_id":"Hardware","totalSales":45000}, {"_id":"Software","totalSales":25000}]
//             Output:
//             {
//               "_thought": "The user is asking for a breakdown/proportion. A PieChart is best for displaying parts of a whole. Recharts PieCharts will map the 'nameKey' to '_id' and 'dataKey' to 'totalSales'.",
//               "componentType": "PieChart",
//               "title": "Revenue Breakdown by Product",
//               "data": [{"_id":"Hardware","totalSales":45000}, {"_id":"Software","totalSales":25000}],
//               "xAxisKey": "_id",
//               "yAxisKeys": ["totalSales"]
//             }

//             Scenario 3: High-Level Overview / KPIs
//             User Query: "Give me a summary of our regional performance"
//             Raw Data: [{"_id":"North America","totalSales":15000}, {"_id":"Europe","totalSales":9500}]
//             Output:
//             {
//               "_thought": "The user explicitly asked for a summary or overview. SummaryCards are the perfect fit to display high-level KPIs. The cards will display the region ('_id') and the total ('totalSales').",
//               "componentType": "SummaryCards",
//               "title": "Regional Performance Summary",
//               "data": [{"_id":"North America","totalSales":15000}, {"_id":"Europe","totalSales":9500}],
//               "xAxisKey": "_id",
//               "yAxisKeys": ["totalSales"]
//             }

//             --- YOUR TURN ---
//             User Query: "${query}"
//             Raw Data: ${JSON.stringify(rawData)}
//             Output ONLY valid JSON matching the schema:
//             `,
//       stream: false,
//     }),
//   });

//   const ollamaData = await ollamaResponse.json();
//   const parsedLlmData = JSON.parse(ollamaData.response);
//   const validatedUI = llmResponseSchema.parse(parsedLlmData);
//   console.log("Validated UI Data after Zod Parsing:", validatedUI);
//   console.log("----------------------------------------------------------");

//   return validatedUI;
// };

// module.exports = generateUI;

const { z } = require("zod");

const generateUI = async (query, rawData) => {
  // 1. Define the Zod Schema to prevent frontend crashes
  const llmResponseSchema = z.object({
    _thought: z.string().optional(), // We are adding this for the AI's Chain of Thought
    componentType: z.enum([
      "BarChart",
      "LineChart",
      "PieChart",
      "AreaChart",
      "RadarChart",
      "SummaryCards",
    ]),
    title: z.string(),
    data: z.array(z.record(z.any())),
    xAxisKey: z.string().nullable().optional(), // Allows null or missing
    yAxisKeys: z.array(z.string()).nullable().optional(), // Allows null or missing
  });

  // call the LLM to generate the UI JSON based on the validated query and raw data
  const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      format: "json", // CRITICAL: Forces strict JSON output

      prompt: `
            You are an expert React UI and Data Visualization engineer. 
            Your task is to analyze a user's analytical query and a raw database array, and output a strictly typed JSON object for Recharts.

            CRITICAL INSTRUCTIONS:
            1. NEVER output \`null\`. If a key is not required, omit it entirely from the JSON.
            2. The "componentType" MUST be exactly one of: "BarChart", "LineChart", "PieChart", "AreaChart", "RadarChart", "SummaryCards".
            3. You must accurately map the exact keys from the Raw Data into the "xAxisKey" and "yAxisKeys".
            4. You MUST process your logic in the "_thought" key first before generating the rest of the schema.

            REQUIRED JSON SCHEMA:
            {
              "_thought": "Briefly explain which chart is best, and identify the exact X and Y data keys from the raw data.",
              "componentType": "...",
              "title": "...",
              "data": [Array of data always objects],
              "xAxisKey": "...", // OMIT if not needed.
              "yAxisKeys": ["..."]
            }

            --- EXAMPLES ---

            Scenario 1: Enterprise Demographics (Radar or Bar)
            User Query: "Show me total sales by customer type"
            Raw Data: [{"_id":"Enterprise","totalSales":4500000}, {"_id":"Returning","totalSales":2500000}, {"_id":"New","totalSales":800000}]
            Output:
            {
              "_thought": "The user wants to compare distinct demographic categories (Customer Types). A RadarChart or BarChart is ideal. The X-axis should be the demographic ('_id') and the Y-axis should be the revenue ('totalSales').",
              "componentType": "RadarChart",
              "title": "Revenue by Customer Type",
              "data": [{"_id":"Enterprise","totalSales":4500000}, {"_id":"Returning","totalSales":2500000}, {"_id":"New","totalSales":800000}],
              "xAxisKey": "_id",
              "yAxisKeys": ["totalSales"]
            }

            Scenario 2: Proportions and Market Share
            User Query: "What is the revenue breakdown by payment method?"
            Raw Data: [{"_id":"Credit Card","totalSales":450000}, {"_id":"Crypto","totalSales":150000}]
            Output:
            {
              "_thought": "The user is asking for a breakdown/proportion of payment methods. A PieChart is best for displaying parts of a whole. Recharts PieCharts will map the 'nameKey' to '_id' and 'dataKey' to 'totalSales'.",
              "componentType": "PieChart",
              "title": "Revenue Breakdown by Payment Method",
              "data": [{"_id":"Credit Card","totalSales":450000}, {"_id":"Crypto","totalSales":150000}],
              "xAxisKey": "_id",
              "yAxisKeys": ["totalSales"]
            }

            Scenario 3: High-Level Overview / KPIs
            User Query: "Give me a summary of our country performance"
            Raw Data: [{"_id":"USA","totalSales":1500000}, {"_id":"Germany","totalSales":950000}]
            Output:
            {
              "_thought": "The user explicitly asked for a summary or overview. SummaryCards are the perfect fit to display high-level KPIs. The cards will display the country ('_id') and the total ('totalSales').",
              "componentType": "SummaryCards",
              "title": "Country Performance Summary",
              "data": [{"_id":"USA","totalSales":1500000}, {"_id":"Germany","totalSales":950000}],
              "xAxisKey": "_id",
              "yAxisKeys": ["totalSales"]
            }

            --- YOUR TURN ---
            User Query: "${query}"
            Raw Data: ${JSON.stringify(rawData)}
            Output ONLY valid JSON matching the schema:
            `,
      stream: false,
    }),
  });

  const ollamaData = await ollamaResponse.json();
  const parsedLlmData = JSON.parse(ollamaData.response);
  const validatedUI = llmResponseSchema.parse(parsedLlmData);
  console.log("Validated UI Data after Zod Parsing:", validatedUI);
  console.log("----------------------------------------------------------");

  return validatedUI;
};

module.exports = generateUI;
