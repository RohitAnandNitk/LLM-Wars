// const BASE_URL = "https://llm-wars.onrender.com/api";
const BASE_URL = "http://localhost:5000/api";

export async function getCompanyGuess(message, model) {
  const response = await fetch(`${BASE_URL}/guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, model }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch guess");
  }

  const data = await response.json();
  return data.guess;
}

export const verifyClueIsFair = async (clue, company, model) => {
  console.log(
    `Verifying clue fairness: ${clue} for company: ${company} using model: ${model}`
  );
  const response = await fetch(`${BASE_URL}/check_clue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clue, company, model }),
  });
  const result = await response.json();
  return result.fair; // should be true/false
};
