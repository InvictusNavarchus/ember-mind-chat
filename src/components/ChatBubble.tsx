
import React from "react";
import { Message } from "../types/chat";
import { formatMessageTime } from "../utils/helpers";
import { User, MessageSquare } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mindmeld-primary flex items-center justify-center text-white">
          <MessageSquare size={18} />
        </div>
      )}
      <div
        className={`chat-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={`text-xs mt-1 opacity-70 text-right ${isUser ? "text-white" : ""}`}>
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
