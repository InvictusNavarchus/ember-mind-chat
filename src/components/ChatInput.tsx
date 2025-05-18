
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "../store/chatStore";
import aiService from "../services/aiService";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, modelSettings, isModelLoaded, isGenerating, setIsGenerating } = useChatStore();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isGenerating || !isModelLoaded) return;

    setInput("");
    
    // Add user message
    addMessage({
      role: "user",
      content: message
    });

    setIsGenerating(true);

    try {
      // Generate AI response
      const response = await aiService.generateResponse(message, modelSettings);
      
      // Add AI response
      addMessage({
        role: "assistant",
        content: response
      });
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error while generating a response. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border rounded-lg bg-background p-2 shadow-sm">
      <div className="flex items-end gap-2">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[60px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-3"
          disabled={!isModelLoaded || isGenerating}
        />
        <Button
          size="icon"
          className={`rounded-full h-10 w-10 ${input.trim() ? "bg-mindmeld-primary hover:bg-mindmeld-primary/90" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!input.trim() || !isModelLoaded || isGenerating}
          onClick={handleSend}
        >
          <Send size={18} />
        </Button>
      </div>
      {!isModelLoaded && (
        <div className="px-3 py-1 text-sm text-muted-foreground">
          <span className="loading-dots">Loading AI model</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
