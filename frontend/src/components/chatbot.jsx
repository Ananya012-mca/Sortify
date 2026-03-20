import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm Sortify's Waste Assistant.\n\nI help you:\n♻️ **Classify waste** - What can I recycle?\n💡 **Get tips** - How do I prepare items?\n🌍 **Learn impact** - Why recycle?\n🏠 **Context help** - Tips for home/office\n🔍 **Item guides** - How to dispose of X?\n\nJust ask naturally! 👇",
      sender: "bot",
      timestamp: new Date(),
      showCategories: true
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(true); // Default true; only set false on first check failure
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const categories = [
    { name: "Plastic", emoji: "🥤", id: "plastic" },
    { name: "Glass", emoji: "🍾", id: "glass" },
    { name: "Metal", emoji: "🥫", id: "metal" },
    { name: "Paper", emoji: "📄", id: "paper" },
    { name: "Cardboard", emoji: "📦", id: "cardboard" },
    { name: "Trash", emoji: "🗑️", id: "trash" }
  ];

  const suggestions = [
    { emoji: "🌍", text: "Tell me a fact" },
    { emoji: "🧴", text: "How to recycle plastic" },
    { emoji: "🔋", text: "Dispose of battery" },
    { emoji: "📍", text: "Tips for home" },
    { emoji: "❓", text: "All categories" },
    { emoji: "🎯", text: "Environmental impact" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const checkApiHealth = async () => {
    try {
      // Use AbortController with manual timeout for wider browser support
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      let response;
      try {
        response = await fetch("http://localhost:5001/health", {
          method: "GET",
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      if (response && response.ok) {
        console.log("✅ Health check OK");
        setApiConnected(true);
        setReconnectAttempts(0);
      } else {
        console.warn("❌ Health check failed:", response && response.status);
        setApiConnected(false);
        scheduleReconnect();
      }
    } catch (error) {
      console.warn("❌ Health check error:", error && error.message ? error.message : error);
      setApiConnected(false);
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = Math.min(1000 * (2 ** reconnectAttempts), 30000); // Exponential backoff
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      checkApiHealth();
    }, delay);
  };

  const retryMessage = async (messageText) => {
    setLastFailedMessage(null);
    await sendMessage(null, messageText);
  };

  const sendMessage = async (e, messageText = null) => {
    e?.preventDefault?.();
    
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    if (!apiConnected) {
      const errorMessage = {
        id: messages.length + 1,
        text: "⚠️ Chatbot API is not connected. Attempting to reconnect...",
        sender: "bot",
        type: "warning",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      checkApiHealth();
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: textToSend,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      // Try streaming endpoint first for real-time responses
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch("http://localhost:5001/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Fall back to non-streaming endpoint
        throw new Error(`API returned status ${response.status}`);
      }

      // Prepare a placeholder bot message and update it incrementally
      const botId = messages.length + 2;
      const botMessage = {
        id: botId,
        text: "",
        sender: "bot",
        type: "stream",
        data: null,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Stream reader (robustly accumulate and handle metadata that may span chunks)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = "";
      let metaBuffer = ""; // store partial metadata JSON across chunks
      const marker = "__RAG_SOURCES__:";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          // If marker present anywhere in accumulated, split into text + metadata
          const markerIndex = accumulated.indexOf(marker);
          if (markerIndex !== -1) {
            const before = accumulated.slice(0, markerIndex);
            const after = accumulated.slice(markerIndex + marker.length);
            // Update message with text before marker
            setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: before } : m));

            // Try to parse metadata (may be partial)
            const candidate = (metaBuffer + after).trim();
            try {
              if (candidate) {
                const sources = JSON.parse(candidate);
                setMessages(prev => prev.map(m => m.id === botId ? { ...m, data: { sources } } : m));
                // clear buffers
                accumulated = "";
                metaBuffer = "";
              }
            } catch (e) {
              // incomplete JSON: store for next chunks
              metaBuffer = candidate;
            }
          } else {
            // No marker yet; update message text with full accumulated content
            setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: accumulated } : m));
          }
        }
      }

      // End of stream: if any leftover metaBuffer exists, try parsing it
      if (metaBuffer) {
        try {
          const sources = JSON.parse(metaBuffer.trim());
          setMessages(prev => prev.map(m => m.id === botId ? { ...m, data: { sources } } : m));
        } catch (e) {
          // ignore
        }
      }

      // If server returned a non-stream JSON inside the message text, attempt a final parse
      // (some fallbacks may send the full JSON as the message body)
      setMessages(prev => prev.map(m => {
        if (m.id !== botId) return m;
        const txt = (m.text || "").trim();
        if (txt.startsWith("{") && txt.includes('"response"')) {
          try {
            const parsed = JSON.parse(txt);
            const newData = m.data || {};
            if (parsed.sources) newData.sources = parsed.sources;
            return { ...m, text: parsed.response || txt, data: newData };
          } catch (e) {
            return m;
          }
        }
        return m;
      }));

      // Mark api as connected
      setApiConnected(true);
      setReconnectAttempts(0);

    } catch (error) {
      console.error("Chat error:", error);
      
      let errorText = "";
      let isConnectionError = false;

      if (error.name === "AbortError") {
        errorText = "⏱️ Request timed out. The API might be slow or unresponsive. Please try again.";
        isConnectionError = true;
      } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorText = "🔌 Unable to connect to chatbot API. Please ensure the API is running:\n\n```python chatbot/chatbot_api.py```";
        isConnectionError = true;
      } else if (error.message.includes("API returned")) {
        errorText = `⚠️ API error: ${error.message}`;
        isConnectionError = true;
      } else {
        errorText = `❌ Error: ${error.message || "An unexpected error occurred"}`;
      }

      if (isConnectionError) {
        setApiConnected(false);
        setLastFailedMessage(textToSend);
        scheduleReconnect();
      }

      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: "bot",
        type: "error",
        timestamp: new Date(),
        retryable: isConnectionError
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const formatMessage = (message) => {
    const text = message.text || "";
    const type = message.type;

    // If message text looks like a JSON payload (backend fallback), try to extract response
    if (text.trim().startsWith("{") && text.includes('"response"')) {
      try {
        const parsed = JSON.parse(text);
        // attach parsed data for structured rendering
        message.data = message.data || {};
        if (parsed.data) message.data.data = parsed.data;
        if (parsed.sources) message.data.sources = parsed.sources;
        message.text = parsed.response || parsed.text || text;
      } catch (e) {
        // ignore parse errors and fall through to raw formatting
      }
    }

    // Error messages with retry button
    if (type === "error") {
      return (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{text}</p>
          {message.retryable && lastFailedMessage && (
            <button 
              className="retry-btn"
              onClick={() => retryMessage(lastFailedMessage)}
              disabled={loading}
            >
              🔄 Retry
            </button>
          )}
        </div>
      );
    }

    // Warning messages
    if (type === "warning") {
      return (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          <p>{text}</p>
        </div>
      );
    }

    // RAG / retrieval responses: show a summary plus citations if available
    if (type === "rag" || type === "rag_fallback" || message.data?.sources) {
      const summary = message.text || (message.data && message.data.answer) || "";
      const sources = message.data?.sources || [];

      return (
        <div className="rag-response">
          {summary && <div className="rag-summary">{summary}</div>}
          {sources.length > 0 && (
            <div className="rag-sources">
              <h5>Sources</h5>
              <ul>
                {sources.map((s, i) => (
                  <li key={i} className="rag-source-item">
                    <strong>{s[0]}</strong>
                    <div className="rag-snippet">{s[1]?.slice(0, 200)}{s[1] && s[1].length > 200 ? '...' : ''}</div>
                    {typeof s[2] === 'number' && <div className="rag-score">Confidence: {(s[2]*100).toFixed(1)}%</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // Handle structured data responses (waste info)
    if (message.data?.data && typeof message.data.data === "object" && type === "info") {
      const info = message.data.data;
      return (
        <div className="waste-info-card">
          {info.description && (
            <div className="info-section">
              <h4>📖 Description</h4>
              <p>{info.description}</p>
            </div>
          )}
          {info.recycling_tips && (
            <div className="info-section">
              <h4>💡 Recycling Tips</h4>
              <p>{info.recycling_tips}</p>
            </div>
          )}
          {info.what_to_do && (
            <div className="info-section highlight">
              <h4>✅ What To Do</h4>
              <p><strong>{info.what_to_do}</strong></p>
            </div>
          )}
          {info.precautions && (
            <div className="info-section">
              <h4>⚠️ Precautions</h4>
              <p>{info.precautions}</p>
            </div>
          )}
          {info.reuse_ideas && (
            <div className="info-section">
              <h4>♻️ Reuse Ideas</h4>
              <p>{info.reuse_ideas}</p>
            </div>
          )}
          {info.impact && (
            <div className="info-section impact">
              <h4>🌍 Environmental Impact</h4>
              <p>{info.impact}</p>
            </div>
          )}
          {info.disposal_method && (
            <div className="info-section">
              <h4>🗑️ Disposal Method</h4>
              <p>{info.disposal_method}</p>
            </div>
          )}
        </div>
      );
    }

    // Format regular text with enhanced markdown
    const formattedText = text
      .split("\n")
      .map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        
        let formatted = line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");
        
        // Add special styling for bullet points
        if (formatted.trim().match(/^[-•✓]/)) {
          formatted = formatted.replace(/^[-•]/, "•").replace(/^✓/, "✅");
        }
        
        return (
          <div key={i} className="message-line" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      });

    return <div className="message-text">{formattedText}</div>;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-left">
          <h3>🤖 Sortify Assistant</h3>
          <p>Smart waste classification & guidance</p>
        </div>
        <div className={`status-indicator ${apiConnected ? 'connected' : 'disconnected'}`}>
          <span className={`status-dot ${apiConnected ? 'pulse' : ''}`}></span>
          <span className="status-text">
            {apiConnected ? "🟢 Online" : "🔴 Offline"}
            {!apiConnected && reconnectAttempts > 0 && ` (Retry ${reconnectAttempts})`}
          </span>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, idx) => (
          <div key={message.id}>
            <div className={`message-wrapper ${message.sender === "user" ? "user-wrapper" : "bot-wrapper"}`}>
              <div className="message-avatar">{message.sender === "user" ? "👤" : "🤖"}</div>
              <div className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}>
                <div className="message-content">
                  {formatMessage(message)}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Show category buttons on first bot message */}
            {message.showCategories && !loading && messages.length === 1 && (
              <div className="categories-section">
                <p className="categories-label">📦 Quick access:</p>
                <div className="categories-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className="category-btn"
                      onClick={(e) => sendMessage(e, `How to recycle ${cat.name.toLowerCase()}?`)}
                      title={`Learn about ${cat.name}`}
                      disabled={!apiConnected}
                    >
                      <span className="cat-emoji">{cat.emoji}</span>
                      <span className="cat-name">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up suggestions */}
            {message.sender === "bot" && messages.length > 1 && idx === messages.length - 1 && !loading && (
              <div className="followup-container">
                <p className="followup-label">💬 You can also ask:</p>
                <div className="followup-grid">
                  {suggestions.slice(0, 3).map((suggestion, sidx) => (
                    <button
                      key={sidx}
                      className="followup-btn"
                      onClick={(e) => sendMessage(e, suggestion.text)}
                      title={suggestion.text}
                      disabled={!apiConnected}
                    >
                      {suggestion.emoji} {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-avatar">🤖</div>
            <div className="message bot-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show initial suggestions */}
        {messages.length === 1 && !loading && (
          <div className="initial-suggestions">
            <p className="suggestions-label">💭 Try these:</p>
            <div className="suggestions-grid">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={(e) => sendMessage(e, suggestion.text)}
                  title={suggestion.text}
                  disabled={!apiConnected}
                >
                  {suggestion.emoji} {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={apiConnected ? "Ask anything about waste recycling..." : "Waiting for API connection..."}
          disabled={loading || !apiConnected}
          className="chatbot-input"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim() || !apiConnected}
          className="chatbot-send-btn"
          title={!apiConnected ? "API not connected - attempting to reconnect..." : "Send message"}
        >
          {loading ? "⏳" : "→"}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
