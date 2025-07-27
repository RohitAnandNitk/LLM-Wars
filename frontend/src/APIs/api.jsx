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
