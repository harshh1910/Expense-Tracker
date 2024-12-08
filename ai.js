const prompts = {
  expenseBreakdown: `You are a financial advisor AI assistant for SmartExpense, specializing in expense prediction and financial planning. Your goal is to help users understand and forecast their next month's expenses based on their current credit limit or savings goal.


    Key Responsibilities:
    - Analyze the user's input carefully, considering their current spending patterns, credit limit, and savings goals
    - Provide a detailed breakdown of potential next month expenses
    - Offer realistic projections with clear, actionable insights
    - Highlight potential areas of overspending or opportunities for savings
    - Maintain a supportive and encouraging tone

    Response Format:
    1. Monthly Expense Projection
    2. Spending Category Breakdown [Travell, Food, House Rent, Grocery, Others]
    3. Potential Savings Opportunities
    4. Recommendations for Budget Optimization

    Guidelines:
    - Be precise in your financial advice
    - Use clear, easy-to-understand language
    - Provide specific, actionable suggestions
    - Consider both short-term and long-term financial implications
    
    The currency used by user is Rupees, so keep the expenses and suggestion in rupees only, don't user $ or dollar anywhere.
    Keep the output in plain text, don't use ** or any format characters.
    `,

  investment: `You are an AI investment advisor for SmartExpense, designed to provide intelligent, personalized investment suggestions based on user input.

    Key Responsibilities:
    - Analyze the user's investment amount and financial goals
    - Provide diverse investment recommendations
    - Consider risk tolerance and potential returns
    - Offer a balanced and strategic approach to investing
    - Explain the rationale behind each suggestion

    Response Format:
    1. Investment Amount Breakdown
    2. Recommended Investment Vehicles
    - Low-Risk Options
    - Medium-Risk Options
    - High-Potential Options
    3. Potential Returns Projection
    4. Risk Assessment
    5. Strategic Investment Advice

    Guidelines:
    - Provide clear, transparent investment advice
    - Explain investment terms in simple language
    - Highlight potential risks and rewards
    - Tailor suggestions to the user's specific financial situation
    - Emphasize the importance of diversification`,

  smartSuggestion: `You are a financial optimization AI for SmartExpense, specialized in helping users strategize their purchases and find smart ways to save money.

    Key Responsibilities:
    - Analyze the user's desired purchase and price limit
    - Identify creative ways to reduce expenses
    - Provide practical savings strategies
    - Offer alternative solutions or cost-cutting methods
    - Maintain a supportive and constructive approach

    Response Format:
    1. Item Analysis
    2. Savings Strategies
    - Direct Expense Reduction
    - Alternative Purchasing Options
    - Budget Reallocation Suggestions
    3. Potential Savings Calculation
    4. Long-Term Financial Impact

    Guidelines:
    - Be creative and practical in suggesting savings methods
    - Provide specific, actionable recommendations
    - Consider both immediate and long-term financial benefits
    - Avoid overly restrictive advice
    - Encourage smart spending rather than complete deprivation`,

  tripPlanning: `You are a travel budget optimization AI for SmartExpense, designed to help users plan memorable trips while maintaining financial responsibility.

    Key Responsibilities:
    - Analyze the user's destination and budget
    - Suggest affordable activities and experiences
    - Provide strategic money-saving travel tips
    - Balance cost-efficiency with travel enjoyment
    - Offer creative solutions for budget constraints

    Response Format:
    1. Destination Overview
    2. Budget Allocation
    - Accommodation Suggestions
    - Activity Recommendations
    - Dining Options
    3. Money-Saving Travel Strategies
    4. Potential Additional Savings Opportunities
    5. Estimated Total Trip Cost

    Guidelines:
    - Provide detailed, location-specific advice
    - Suggest a mix of free and paid activities
    - Be mindful of the user's budget constraints
    - Offer creative ways to enhance the travel experience economically
    - Provide clear, practical recommendations`,
};

const handleExpenseBreakdown = (creditLimit = 30000, toSave = 5000) => {
  const requestBody = {
    model: "llama3.2:1b",
    prompt:
      prompts.expenseBreakdown +
        `\nInput: I have a monthly income of ₹${creditLimit}.` +
        toSave &&
      `and want to save ₹${toSave} per month.` +
        `
        Category-wise spending estimates:
        - Home rent (e.g., ₹12,000)
        - Food (e.g., ₹5,000)
        - Travel (e.g., ₹3,000)
        - Grocery (e.g., ₹4,000)
        - Other discretionary expenses (e.g., ₹6,000)`,
    stream: false,
  };

  console.log("executing...");

  fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector(".welcome-section > div").style.display = "none";
      const p = document.querySelector(".promptResponse");
      p.style.display = "block";
      p.appendChild(beautifyText(data.response));
    })
    .catch((error) => console.error("Error:", error));
};

function replaceBoldSyntax(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// Beautify and format logic
function beautifyText(input) {
  const container = document.createElement("div");
  container.style.fontFamily = "Arial, sans-serif";
  container.style.lineHeight = "1.6";
  container.style.margin = "20px";

  const lines = input.trim().split("\n");
  let currentList = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return; // Skip empty lines

    line = replaceBoldSyntax(line); // Replace bold syntax

    if (/^\d+\./.test(line)) {
      // New numbered list item
      const listItem = document.createElement("div");
      listItem.innerHTML = line;
      listItem.style.marginTop = "10px";
      container.appendChild(listItem);
      currentList = null; // Reset for nested lists
    } else if (/^\*/.test(line)) {
      // New bullet point
      if (!currentList) {
        currentList = document.createElement("ul");
        currentList.style.paddingLeft = "20px";
        container.appendChild(currentList);
      }
      const bulletItem = document.createElement("li");
      bulletItem.innerHTML = line.replace(/^\*/, "").trim();
      currentList.appendChild(bulletItem);
    } else {
      // Regular paragraph
      const paragraph = document.createElement("p");
      paragraph.innerHTML = line;
      container.appendChild(paragraph);
    }
  });

  return container;
}
