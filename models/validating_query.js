const validatingQuery = async (query) => {
  const routerResponse = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      format: "json",
      prompt: `
        You are an expert database routing assistant for an enterprise e-commerce platform.
        Your job is to analyze the user's query and decide exactly how the MongoDB aggregation pipeline should group the data.
        
        You must map the query intent to one of these valid schema fields:
        - Choose "$region" if they ask about regions, areas, continents (e.g., North America, Europe, Asia).
        - Choose "$country" if they mention specific nations or countries (e.g., USA, Germany, India, Japan).
        - Choose "$productCategory" if they ask about high-level groupings, categories, items, hardware, or software.
        - Choose "$subCategory" if they ask about specific specific items like laptops, antivirus, mice, cables, or consulting.
        - Choose "$customerType" if they ask about user demographics, clients, segments, new users, returning users, or enterprise.
        - Choose "$paymentMethod" if they ask about how people paid, transactions types, credit cards, paypal, or crypto.
        
        CRITICAL INSTRUCTIONS:
        1. Fix any minor typos or spelling mistakes in the user's query internally before deciding.
        2. If you are completely unsure or the query is ambiguous, default to "$region".
        
        User Query: "${query}"
        
        Output ONLY a valid JSON object matching this exact schema:
        {
          "groupBy": "$region" | "$country" | "$productCategory" | "$subCategory" | "$customerType" | "$paymentMethod"
        }
    `,
      stream: false,
    }),
  });

  const routerData = await routerResponse.json();
  const parsedIntent = JSON.parse(routerData.response);
  console.log("Parsed Intent from Router LLM:", parsedIntent);

  return parsedIntent;
};

module.exports = validatingQuery;
