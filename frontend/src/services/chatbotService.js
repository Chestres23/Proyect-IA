/**
 * ============================================================================
 * Servicio de ChatBot
 * ============================================================================
 * POST /api/chat { message }
 */

const CHATBOT_API_URL =
  process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:3005";

async function chatbotRequest(endpoint, options = {}) {
  const url = `${CHATBOT_API_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `Error HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error en API ChatBot:", {
      endpoint,
      error: error.message,
    });
    throw error;
  }
}

const chatbotService = {
  async chat(message) {
    return chatbotRequest("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

export default chatbotService;
