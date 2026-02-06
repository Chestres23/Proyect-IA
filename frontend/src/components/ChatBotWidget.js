import React, { useState } from "react";
import "./ChatBotWidget.css";
import chatbotService from "../services/chatbotService";

function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hola, soy tu asistente virtual. En que puedo ayudarte?",
    },
  ]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatbotService.chat(text);
      const answer = response?.answer || "No tengo una respuesta en este momento.";
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: err.message || "Error en el chat." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <h4>Asistente</h4>
              <span>Soporte rapido</span>
            </div>
            <button className="chatbot-close" onClick={handleToggle}>
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  "chatbot-message " +
                  (msg.role === "user" ? "from-user" : "from-bot")
                }
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chatbot-message from-bot">Escribiendo...</div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} disabled={loading}>
              Enviar
            </button>
          </div>
        </div>
      )}

      <button
        className="chatbot-fab"
        onClick={handleToggle}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
      >
        {open ? (
          <span className="chatbot-fab-text">×</span>
        ) : (
          <img
            className="chatbot-fab-image"
            src="https://img.freepik.com/vector-gratis/chatbot-mensaje-chat-vectorart_78370-4104.jpg"
            alt="Chatbot"
          />
        )}
      </button>
    </div>
  );
}

export default ChatBotWidget;
