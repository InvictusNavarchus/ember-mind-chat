
import React from "react";
import { MessageSquare } from "lucide-react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mindmeld-primary flex items-center justify-center text-white">
        <MessageSquare size={18} />
      </div>
      <div className="chat-bubble assistant-bubble">
        <div className="flex items-center">
          <div className="loading-dots">Thinking</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
