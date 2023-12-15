const apiUrl = "https://the-trivia-api.com/v2/questions";

export async function getTriviaQuestion() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch trivia question. Status: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Error fetching trivia question:", error.message);
    throw error;
  }
}
