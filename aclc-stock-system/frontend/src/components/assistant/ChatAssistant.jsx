import { useState, useEffect, useRef } from "react";
import { chatbotService } from "@/services/chatbotService";

export default function ChatAssistant({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const streamMessage = async (text) => {
    let current = "";

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", timestamp: Date.now() },
    ]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].content = current;
        return updatedMessages;
      });
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message, timestamp: Date.now() },
    ]);
    setIsTyping(true);
    try {
      const response = await chatbotService.sendMessage(message);
      setIsTyping(false);
      await streamMessage(response.reply);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
    setInputMessage("");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="bg-[#1e3a5f] text-white px-4 py-3 flex item-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bot-icon lucide-bot text-[#1e3a5f]"
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Store Assistant</p>
              <p className="font-semibold text-xs">ACLC School Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 rounded-lg p-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[#d4a843]/20 flex items-center justify-center mx-auto mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bot-icon lucide-bot text-[#d4a843]"
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#1e3a5f]">
              Hi! I'm your store assistant.
            </p>
            {messages.length === 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Ask me about items, prices, sizes, or stock availability!
              </p>
            )}
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-full ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" ? (
                // AI MESSAGE
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-xs flex-shrink-0">
                    AI
                  </div>

                  <div className="flex flex-col items-start min-w-0">
                    <div className=" px-4 py-2 text-sm leading-relaxed rounded-2xl rounded-bl-sm bg-white text-slate-900 border border-slate-200 shadow-sm break-word ">
                      {message.content}
                    </div>

                    <span className="text-[10px] mt-1 ml-1 opacity-50">
                      {message.timestamp &&
                        new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : (
                // USER MESSAGE
                <div className="flex flex-col items-end max-w-[85%]">
                  <div className="flex items-end gap-2">
                    <div className=" px-4 py-2 text-sm leading-relaxed rounded-2xl rounded-br-sm bg-[#1e3a5f] text-white shadow-sm break-words">
                      {message.content}
                    </div>

                    <div className="w-7 h-7 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-xs flex-shrink-0">
                      U
                    </div>
                  </div>

                  <span className="text-[10px] mt-1 mr-9 opacity-50">
                    {message.timestamp &&
                      new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-xs">
                  AI
                </div>
                <div className="bg-white border px-4 py-2 rounded-2xl text-sm text-slate-500">
                  typing <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-200 bg-white flex gap-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Ask about items, sizes, prices..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a5f] transition-colors"
          />
          <button
            type="button"
            onClick={() => handleSendMessage(inputMessage)}
            className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e3a5f]/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send-icon lucide-send w-4 h-4 text-white"
            >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
              <path d="m21.854 2.147-10.94 10.939" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
