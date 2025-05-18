
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useChatStore } from "../store/chatStore";
import aiService from "../services/aiService";

const ModelLoader: React.FC = () => {
  const { isModelLoaded, setModelLoaded } = useChatStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isModelLoaded) return;

    const loadModel = async () => {
      console.log("Starting model loading process...");
      // Start fake progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress > 95) {
          currentProgress = 95;
          clearInterval(interval);
        }
        setProgress(Math.min(currentProgress, 95));
      }, 500);

      try {
        // Actual model loading
        await aiService.loadModel();
        
        // Complete progress
        setProgress(100);
        setTimeout(() => {
          setModelLoaded(true);
        }, 500);
      } catch (error) {
        console.error("Error loading model:", error);
        setProgress(0);
      } finally {
        clearInterval(interval);
      }
    };

    loadModel();
  }, [isModelLoaded, setModelLoaded]);

  if (isModelLoaded) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="max-w-md w-full bg-card border rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Loading MindMeld
        </h2>
        <p className="text-center text-muted-foreground mb-4">
          Initializing the AI model for your browser
        </p>
        
        <Progress value={progress} className="h-2 mb-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{Math.round(progress)}% Complete</span>
          {progress < 100 ? (
            <span>Loading model...</span>
          ) : (
            <span>Ready!</span>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          MindMeld runs entirely in your browser. The model is loading into your device's memory and no data will be sent to external servers.
        </p>
      </div>
    </div>
  );
};

export default ModelLoader;
